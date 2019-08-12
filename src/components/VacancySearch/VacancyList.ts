import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { SearchResult } from '../Search';
import { IGeoPoint, IShopVacancy } from '@/models';
import { isPointWithinRadius, getDistance } from 'geolib';
import VacancyGroupComponent from './VacancyGroup.vue';
import VacancyComponent from './Vacancy.vue';


export type VacancyGroup = {
    text: string;
    items: IShopVacancy[],
    caption?: string,
    childs?: VacancyGroup[],
    highlight?: boolean;
}


@Component({ components: { VacancyGroupComponent, VacancyComponent } })
export default class VacancyListComponent extends Vue {

    @Prop()
    location?: SearchResult;

    @Prop()
    profession?: string;

    @Prop({ default: 1000 })
    radius!: number;

    @Prop({ default: [] })
    vacancies!: IShopVacancy[];

    get title(): string {
        const loc = this.location;
        if (!loc) return '';

        switch (loc.Kind) {
            case 'IAddress':
                return 'адрес ' + loc.Name;
            case 'IMetroLine':
                return 'линия метро ' + loc.Name;
            case 'IMetroStation':
                return 'линия метро ' + loc.Line.Name + ', станция ' + loc.Name;
            default:
                return '';
        }
    }

    get groups(): VacancyGroup[] | null {
        let groups: VacancyGroup[] = [];

        if (!this.location) {
            const regions = new Set(this.vacancies.map(x => x.Region));
            const locations = new Set(this.vacancies.map(x => x.Locality));

            if (regions.size == 1 || locations.size == 1)
                return null;

            const grouped: { [key: string]: { [key: string]: IShopVacancy[] } } = {};

            this.vacancies.forEach(v => {
                if (!(v.Region in grouped))
                    grouped[v.Region] = {};

                const regionEntry = grouped[v.Region];
                if (!(v.Locality in regionEntry))
                    regionEntry[v.Locality] = [];

                const localityEntry = regionEntry[v.Locality];
                localityEntry.push(v);
            });


            for (const region in grouped) {
                const regionEntry = grouped[region];
                const regionGroup: VacancyGroup = { text: region, items: [], childs: [] };
                groups.push(regionGroup);


                for (const locality in regionEntry) {
                    const vacancies = regionEntry[locality];
                    const localityGroup: VacancyGroup = { text: locality, items: vacancies };
                    regionGroup.childs!.push(localityGroup);
                }
            }

            return groups;
        }


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
                return {
                    text: st.Name,
                    items: nearest,

                }
            });
        }

        if (this.location.Kind == 'IMetroStation') {
            const name = this.location.Name;
            groups = this.location.Line.Stations.map(st => {
                const center = st.GeoPoint;
                let nearest = this.vacancies.filter(x => this.vacancyInRadus(x, center));
                return {
                    text: st.Name,
                    items: nearest,
                    highlight: st.Name == name
                }
            });
        }

        return groups.length ? groups : null;
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