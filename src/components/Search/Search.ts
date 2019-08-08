import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { QSelect, TouchSwipe } from 'quasar'
import * as api from '@/api/search';
import { IAddress, IMetroLine, IMetroStation, IAddressSuggestion } from '@/models';

export type SelectedEvent = IAddress | IMetroLine | IMetroStation | null;
declare type Suggestion = { text: string, obj: IAddressSuggestion | IMetroLine | IMetroStation };


@Component
export default class SearchComponent extends Vue {
    @Prop()
    public point?: { lat: number, lng: number } | null;


    private mode: 'address' | 'metroLine' = 'address';
    private suggestions: Suggestion[] = [];
    private selected: Suggestion | null = null;

    private rawInput: string = '';

    get inputForCurrentSuggestionsMode(): string {
        if (this.mode == 'metroLine')
            return this.rawInput.match(/.*\s(.*)/)![1];

        return this.rawInput;
    }

    get suggestionsIcon() {
        const map = {
            'address': 'map',
            'metroLine': 'subway'
        }
        return map[this.mode];
    }

    get selectComponent() {
        return this.$refs.select as QSelect;
    }

    async onSearchTyping(input: string, update: Function, abort: Function) {
        this.rawInput = input;
        this.mode = 'address';

        const selectInputValue = (<any>this.selectComponent).inputValue;
        if (selectInputValue == '' && this.selected != null) {
            this.reset();
        };

        if (input.length < 3) {
            abort();
            return;
        }

        if (input.startsWith('м ')) {
            this.mode = 'metroLine';
            if (this.inputForCurrentSuggestionsMode.length < 2) {
                abort();
                return;
            }
        }

        await this.fetchSuggestions(input);
        update();
    }

    async fetchSuggestions(input: string) {
        let suggestions: Suggestion[] = [];

        if (this.mode == 'address') {
            suggestions = (await api.getAddressSuggestions(input)).map(s => ({ text: s.Full, obj: s }));
        }

        if (this.mode == 'metroLine') {
            if (!this.point) return;
            const lat = this.point.lat;
            const lon = this.point.lng;
            suggestions = (await api.getMetroLines({ Lat: lat, Lon: lon }, 20000, this.inputForCurrentSuggestionsMode))
                .map(s => ({ text: s.Name, obj: s }))
        }

        this.suggestions = suggestions;
    }

    onMetroStationClick(s: IMetroStation) {
        this.selected = { text: s.Name, obj: s };
    }

    reset() {
        this.mode = 'address';
        this.selected = null;
        this.selectComponent.updateInputValue('', true);
        this.rawInput = '';
    }

    containsInInput(str: string) {
        return str.toLocaleLowerCase().includes(this.inputForCurrentSuggestionsMode.toLocaleLowerCase());
    }

    @Emit('selected')
    @Watch('selected')
    async emitSelected(): Promise<SelectedEvent> {
        if (!this.selected) return null;

        if (this.mode === 'address') {
            const address = await api.getAddress((<IAddressSuggestion>this.selected.obj).Full);
            return address;
        }

        return <IMetroLine>this.selected.obj;
    }

}