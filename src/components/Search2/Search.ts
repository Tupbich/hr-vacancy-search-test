import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import * as api from '@/api/search';
import { IAddress, IMetroLine, IMetroStation, IAddressSuggestion } from '@/models';
import { QMenu } from 'quasar';

export type SearchLocation = IAddress | IMetroLine | IMetroStation | null;
declare type Suggestion = { text: string, obj: any, childs?: Suggestion[] };

declare type SuggestionMode = 'address' | 'metro';

const suggestionModeIcons: { [key in SuggestionMode]: string } = {
    'address': 'map', 'metro': 'subway'
}


@Component
export default class SearchComponent extends Vue {
    @Prop()
    public point?: { lat: number, lng: number } | null;
    public input = '';
    private mode: SuggestionMode | null = null;
    private suggestions: Suggestion[] = [];
    private loading = false;
    private stopFilter = false;
    private debounce = 0;

    get modeIcon() {
        if (!this.mode) return 'search';
        return suggestionModeIcons[this.mode];
    }

    get showSuggestions(): boolean {
        return this.suggestions.length > 0;
    }

    get suggestionsMenu(): QMenu {
        return this.$refs.suggestionsMenu as QMenu;
    }

    async onInput() {
        if (!this.input) return this.reset();
        if (this.stopFilter) return this.stopFilter = false;

        const modeDef = this.getModeDef(this.input);

        if (this.mode != modeDef.mode) {
            this.mode = modeDef.mode;
            this.debounce = 500;
        }

        if (modeDef.input.length < 3) return;

        await this.updateSuggestions(modeDef.input);
    }

    onClick() {
        if (this.showSuggestions)
            this.suggestionsMenu.show();
    }

    onFocus() {
        this.suggestionsMenu.show();
    }

    onBlur() {
        this.suggestionsMenu.hide();
    }

    @Emit('selected')
    async onSuggestionClick(s: Suggestion) {
        this.suggestionsMenu.hide();
        this.stopFilter = true;
        this.input = s.text;

        if (this.mode === 'address') {
            const address = await api.getAddress((<IAddressSuggestion>s.obj).Full);
            return address;
        }

        return s.obj;
    }

    getModeDef(input: string): { mode: SuggestionMode, input: string } {
        if (input.startsWith('м ')) {
            return { mode: 'metro', input: input.match(/.*\s(.*)/)![1] };
        }

        return { mode: 'address', input };
    }

    reset() {
        this.mode = null;
        this.debounce = 0;
        this.input = '';
        this.suggestions = [];
        this.stopFilter = false;
        this.suggestionsMenu.hide();
        this.$emit('selected', null);
    }

    containsInInput(str: string) {
        if (!this.input) return false;
        const modeDef = this.getModeDef(this.input);
        return str.toLocaleLowerCase().includes(modeDef.input.toLocaleLowerCase());
    }

    async updateSuggestions(input: string) {

        this.loading = true;
        let suggestions: Suggestion[] = [];
        try {
            if (this.mode == 'address') {
                suggestions = (await api.getAddressSuggestions(input)).map(s => ({ text: s.Full, obj: s }));
            }

            if (this.mode == 'metro') {
                if (!this.point) return;
                const lat = this.point.lat;
                const lon = this.point.lng;
                suggestions = (await api.getMetroLines({ Lat: lat, Lon: lon }, 20000, input))
                    .map(s => ({
                        text: s.Name,
                        obj: s,
                        childs: s.Stations.map(st => ({
                            text: st.Name,
                            obj: st
                        }))
                    }))
            }
        } catch (error) {

        }

        this.loading = false;
        this.suggestions = suggestions;
        this.suggestionsMenu.show();
    }

}