import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline } from 'vue2-leaflet';
import { Icon, Map, LatLngBounds, LatLngBoundsExpression, Polygon, Circle } from 'leaflet';
import { Notify } from 'quasar'
import { getProfessions, getShopVacancies, getMetroLines } from '@/api';
import AddressSearch from "../AddressSearch/AddressSearch.vue";
import Search from "../Search2/Search.vue";

const LMarkerCluster = require('vue2-leaflet-markercluster');

import 'leaflet/dist/leaflet.css';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const components = { AddressSearch, Search, LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline, LMarkerCluster };

@Component({ components })
export default class MapComponent extends Vue {
    zoom = 13;
    center: any = { lat: 59.93085, lng: 30.366211 };
    bounds: LatLngBounds | null = null;

    professions: any[] = [];
    selectedProfessions: any[] = [];

    shops: any[] = [];
    focusedShop: any = null;

    addressCircle: any = null;
    metroLines: any[] = [];


    async created() {
        this.professions = await getProfessions();
    }

    get map() {
        const map = (this.$refs.map as any).mapObject;
        return map as Map
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
        this.setMapView(coord);

    }

    onShopClick(shop: any) {
        const coord = [shop.Lat, shop.Lon] as [number, number];
        this.setMapView(coord);
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
        //if (this.bounds == null) return;
        //const nw = this.bounds.getNorthWest();
        //const se = this.bounds.getSouthEast();
        //const lines = await getMetroLines({ bounds: [[nw.lat, nw.lng], [se.lat, se.lng]] });
        //lines.forEach((l: any) => l.points = l.stations.map((st: any) => ([st.lat, st.lng])));
        //this.metroLines = lines;
    }

    onMapInit() {
        this.bounds = this.map.getBounds();
    }

    zoomUpdated(zoom: number) {
        this.zoom = zoom;
    }

    centerUpdated(center: LatLngBounds) {
        this.center = center;
    }

    boundsUpdated(bounds: LatLngBounds) {
        this.bounds = this.map.getBounds();
    }

    setMapView(center: [number, number]) {
        const zoom = this.zoom < 14 ? 14 : this.zoom;
        this.map.setView(center, zoom);
    }
}