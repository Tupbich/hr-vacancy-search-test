import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline } from 'vue2-leaflet';
import { Icon, Map, LatLngBounds, LatLngBoundsExpression, Polygon, Circle, LatLng, LatLngExpression } from 'leaflet';
import { getProfessions, getShopVacancies } from '@/api';
import { getMetroLines } from '@/api/search';
import { getBounds, getCenter, getBoundsOfDistance } from 'geolib';
import Search, { SearchLocation } from "../LocationSearch";
import AddressMarker from './components/AddressMarker';
import MetroLineMarker from './components/MetroLineMarker';
import VacancyList from '../VacancySearch/VacancyList';


const LMarkerCluster = require('vue2-leaflet-markercluster');

import 'leaflet/dist/leaflet.css';
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { IMetroLine, IMetroStation, IShopVacancy } from '@/models';

delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const components = {
    Search, VacancyList, AddressMarker, MetroLineMarker,
    LMap, LTileLayer, LMarker, LCircleMarker, LIcon, LPolygon, LCircle, LTooltip, LPolyline, LMarkerCluster
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

    searchRadius = 1000;
    searchLocation: SearchLocation = null;

    metroLines: IMetroLine[] = [];


    async created() {
        this.professions = await getProfessions();
    }

    get map() {
        const map = (this.$refs.map as any).mapObject;
        return map as Map
    }

    get fetchBounds(): LatLngBounds | null {
        if (!this.bounds) return null;
        //const b = getBoundsOfDistance({ lat: this.center.lat, lon: this.center.lng }, 30000);
        //const sw = [b[0].latitude, b[0].longitude] as [number, number];
        //const ne = [b[1].latitude, b[1].longitude] as [number, number];

        return this.bounds.pad(5);
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

    onShopClick(shop: IShopVacancy) {
        console.log("TCL: MapComponent -> onShopClick -> shop", shop)

        this.setMapView({ center: [shop.GeoPoint.Lat, shop.GeoPoint.Lon] });
    }

    onMetroClick(m: IMetroLine | IMetroStation) {
        this.onSearchSelect(m)
    }


    @Watch('fetchBounds', { immediate: true })
    @Watch('selectedProfessions', { immediate: false })
    async fetchVacancies() {

        let bounds = this.fetchBounds;
        if (bounds == null) return;

        
        const nw = bounds.getNorthWest();
        const se = bounds.getSouthEast();

        let shops = await getShopVacancies({
            bounds: [[nw.lat, nw.lng], [se.lat, se.lng]],
            professions: this.selectedProfessions
        });

        //const center = this.bounds.getCenter();
        //shops = shops.sort((a, b) => center.distanceTo([a.Lat, a.Lon]) - center.distanceTo([b.Lat, b.Lon]));
        this.shops = shops;
    }

    @Watch('fetchBounds', { immediate: true })
    async fetchMetroStations() {
        if (this.fetchBounds == null) return;
        const lines = await getMetroLines({ Lat: this.center.lat, Lon: this.center.lng }, 50000);
        this.metroLines = lines;
    }

    isActiveMetro(m: IMetroLine) {
        const loc = this.searchLocation;
        if (!loc) return false;
        if (loc.Kind == 'IMetroLine') return loc.Name == m.Name;
        if (loc.Kind == 'IMetroStation') return loc.Line.Name == m.Name;
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