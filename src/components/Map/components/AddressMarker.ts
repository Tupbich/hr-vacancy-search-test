import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IAddress } from '@/models';
import { LCircle, LLayerGroup, LIcon, LMarker } from 'vue2-leaflet';

@Component({ components: { LCircle, LLayerGroup, LIcon, LMarker } })
export default class AddressMarkerComponent extends Vue {
    @Prop() radius!: number;
    @Prop() address!: IAddress;

    get point() {
        return [this.address.GeoPoint.Lat, this.address.GeoPoint.Lon];
    }
}