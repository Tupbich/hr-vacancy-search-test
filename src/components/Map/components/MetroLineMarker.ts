import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { IMetroLine, IMetroStation } from '@/models';
import { LCircle, LCircleMarker, LLayerGroup, LIcon, LMarker, LPolyline, LTooltip } from 'vue2-leaflet';


@Component({ components: { LPolyline, LTooltip, LIcon, LMarker, LLayerGroup, LCircleMarker, LCircle } })
export default class MetroLineMarkerComponent extends Vue {

    @Prop()
    metroLine!: IMetroLine;

    @Prop({ default: 1 })
    opacity!: number;

    @Prop()
    active!: boolean;

    @Prop()
    radius!: number;

    get color() {
        return '#' + this.metroLine.HexColor;
    }

    get points() {
        return this.metroLine.Stations.map(st => ([st.GeoPoint.Lat, st.GeoPoint.Lon]));
    }

    @Emit('click')
    emitClick(target: IMetroLine | IMetroStation) {
        return target;
    }
}