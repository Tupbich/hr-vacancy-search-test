import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { SearchLocation } from '../LocationSearch';
import { IGeoPoint, IShopVacancy } from '@/models';
import { isPointWithinRadius, getDistance } from 'geolib';

declare type VacanciesGroup = {
    text: string;
    items: IShopVacancy[],
    caption?: string,
    childs?: VacanciesGroup[]
}


@Component
export default class VacancyListComponent extends Vue {


    @Prop()
    location?: SearchLocation;

    @Prop()
    profession?: string;

    @Prop({ default: 1000 })
    radius!: number;

    @Prop({ default: [] })
    vacancies!: IShopVacancy[];

    get highlightGroupText() {
        if (!this.location) return null;
        if (this.location.Kind == 'IMetroStation') return this.location.Name;
        return null;
    }

    get groups(): VacanciesGroup[] | null {

        if (!this.location)
            return null;

        let groups: VacanciesGroup[] = [];

        if (this.location.Kind == 'IAddress') {
            const center = this.location.GeoPoint;
            let nearest = this.vacancies.filter(x => this.vacancyInRadus(x, center));
            let other = this.vacancies.filter(x => nearest.every(n => n != x));

            nearest = this.sortByDistance(nearest, center);
            other = this.sortByDistance(other, center);

            groups.push({ text: 'Вблизи', items: nearest });
            groups.push({ text: 'Остальные', items: other, caption: 'по мере удаления' });
        }

        if (this.location.Kind == 'IMetroLine') {
            groups = this.location.Stations.map(st => {
                const center = st.GeoPoint;
                let nearest = this.vacancies.filter(x => this.vacancyInRadus(x, center));
                return { text: st.Name, items: nearest }
            });
        }

        if (this.location.Kind == 'IMetroStation') {
            groups = this.location.Line.Stations.map(st => {
                const center = st.GeoPoint;
                let nearest = this.vacancies.filter(x => this.vacancyInRadus(x, center));
                return { text: st.Name, items: nearest }
            });
        }


        return groups;
    }

    vacancyInRadus(v: IShopVacancy, center: IGeoPoint) {
        return isPointWithinRadius(
            { lat: v.GeoPoint.Lat, lon: v.GeoPoint.Lon },
            { lat: center.Lat, lon: center.Lon },
            this.radius);
    }

    sortByDistance(vacancies: IShopVacancy[], center: IGeoPoint): IShopVacancy[] {
        const point = { lat: center.Lat, lon: center.Lon };
        return vacancies.sort((a, b) =>
            getDistance(point, { lat: a.GeoPoint.Lat, lon: a.GeoPoint.Lon }) -
            getDistance(point, { lat: b.GeoPoint.Lat, lon: b.GeoPoint.Lon }));
    }

    @Emit('shop:mouseenter')
    onShopMouseEnter(s: IShopVacancy) {
        return s;
    }

    @Emit('shop:mouseleave')
    onShopMouseLeave(s: IShopVacancy) {
        return s;
    }

    @Emit('shop:click')
    onShopClick(s: IShopVacancy) {
        return s;
    }
}