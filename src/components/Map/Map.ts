import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline } from 'vue2-leaflet';
import { Icon, Map, LatLngBounds, LatLngBoundsExpression, Polygon, Circle, LatLng, LatLngExpression } from 'leaflet';
import { Notify } from 'quasar'
import { getProfessions, getShopVacancies } from '@/api';
import { getMetroLines } from '@/api/search';
import { getBounds, getCenter } from 'geolib';

import AddressSearch from "../AddressSearch/AddressSearch.vue";
import Search, { SearchLocation } from "../Search2/";
import AddressMarker from './components/AddressMarker';
import MetroLineMarker from './components/MetroLineMarker';


const LMarkerCluster = require('vue2-leaflet-markercluster');

import 'leaflet/dist/leaflet.css';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { IMetroLine } from '@/models';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const components = {
    AddressSearch, AddressMarker, MetroLineMarker,
    Search, LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline, LMarkerCluster
};

@Component({ components })
export default class MapComponent extends Vue {
    zoom = 13;
    center = { lat: 59.93085, lng: 30.366211 };
    bounds: LatLngBounds | null = null;

    professions: any[] = [];
    selectedProfessions: any[] = [];

    shops: any[] = [];
    focusedShop: any = null;

    addressCircle: any = null;

    searchRadius = 2000;
    searchLocation: SearchLocation = null;

    metroLines: IMetroLine[] = [];


    async created() {
        this.professions = await getProfessions();
    }

    get map() {
        const map = (this.$refs.map as any).mapObject;
        return map as Map
    }


    onSearchSelect(input: SearchLocation) {
        this.searchLocation = input;
        if (!input) return;

        let center: [number, number] = [0, 0];

        if (input.Kind == 'IAddress') {
            center = [input.GeoPoint.Lat, input.GeoPoint.Lon]
        }

        if (input.Kind == 'IMetroStation') {
            center = [input.GeoPoint.Lat, input.GeoPoint.Lon]
        }

        if (center[0] > 0 && center[1] > 0)
            this.setMapView({ center: center });

        if (input.Kind == 'IMetroLine') {
            const points = input.Stations.map(st => ({ lat: st.GeoPoint.Lat, lon: st.GeoPoint.Lon }));
            const b = getBounds(points) as { [key: string]: number };
            this.setMapView({ bounds: { ne: [b.maxLat, b.maxLng], sw: [b.minLat, b.minLng] } })
        }

    }

    onAddressSelect(address: any) {

        this.addressCircle = null;

        if (address == null) {
            return;
        }

        if (!address.GeoPoint) {
            Notify.create('Не удалось определить координаты для указанного адреса, попробуйте ввести другой');
            return;
        }

        const coord = [address.GeoPoint.Lat, address.GeoPoint.Lon] as [number, number];
        this.addressCircle = { latlng: coord, radius: 2000 };
        this.setMapView({ center: coord });

    }

    onShopClick(shop: any) {
        this.setMapView({ center: [shop.Lat, shop.Lon] });
    }

    onMetroStationClick(station: any, line: any) {
        console.log(station);
    }

    onMetroLineClick(line: any) {
        console.log(line);
    }

    @Watch('bounds', { immediate: true })
    @Watch('selectedProfessions', { immediate: false })
    async fetchVacancies() {
        if (this.bounds == null) return;
        const nw = this.bounds.getNorthWest();
        const se = this.bounds.getSouthEast();
        let shops = await getShopVacancies({
            bounds: [[nw.lat, nw.lng], [se.lat, se.lng]],
            professions: this.selectedProfessions
        });

        const center = this.bounds.getCenter();
        shops = shops.sort((a, b) => center.distanceTo([a.Lat, a.Lon]) - center.distanceTo([b.Lat, b.Lon]));
        this.shops = shops;
    }

    @Watch('bounds', { immediate: true })
    async fetchMetroStations() {
        if (this.bounds == null) return;
        const lines = await getMetroLines({ Lat: this.center.lat, Lon: this.center.lng }, 20000);
        this.metroLines = lines;
    }

    onMapInit() {
        this.bounds = this.map.getBounds();
    }

    zoomUpdated(zoom: number) {
        this.zoom = zoom;
    }

    centerUpdated(center: LatLng) {
        this.center = center;
    }

    boundsUpdated(bounds: LatLngBounds) {
        this.bounds = this.map.getBounds();
    }

    setMapView(target: { center?: LatLngExpression, bounds?: { sw: LatLngExpression, ne: LatLngExpression } }) {
        const { center, bounds } = target;
        if (!center && !bounds) return;
        const zoom = this.zoom < 14 ? 14 : this.zoom;

        if (center)
            this.map.setView(center, zoom, { animate: true });
        if (bounds)
            this.map.fitBounds(new LatLngBounds(bounds.sw, bounds.ne), { animate: true, padding: [10, 10] });
    }
}