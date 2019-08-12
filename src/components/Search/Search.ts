import { Vue, Component, Prop, Emit, Watch } from "vue-property-decorator";
import { IAddress, IMetroLine, IMetroStation, IShopVacancy } from '@/models';
import { QMenu, QInput } from 'quasar';
import { ISuggestionProvider, Suggestion } from './index';
import { AddressSuggestionProvider, VacancySuggestionProvider, MetroSuggestionProvider } from './SuggestionProviders';

export type SearchResult = IAddress | IMetroLine | IMetroStation | IShopVacancy | null;


@Component
export default class SearchComponent extends Vue {
    @Prop()
    public point?: { lat: number, lng: number } | null;

    @Prop({ default: () => ([]) })
    public metroLines!: IMetroLine[];

    @Prop({ default: () => ([]) })
    public vacancies!: IShopVacancy[];

    public input = '';
    public loading = false;
    public debounce = 0;
    private suggestions: Suggestion[] = [];

    private currentProvider: ISuggestionProvider | null = null;
    private providers: ISuggestionProvider[] = [];

    private stopFilter = false;
    private readonly modeMenuShoving = false;


    created() {
        this.providers = [
            new AddressSuggestionProvider(),
            new MetroSuggestionProvider(() => this.metroLines),
            new VacancySuggestionProvider(() => this.vacancies)
        ]
    }

    get showSuggestions(): boolean {
        return this.suggestions.length > 0;
    }

    get suggestionsMenu(): QMenu {
        return this.$refs.suggestionsMenu as QMenu;
    }

    get inputField(): QInput {
        return this.$refs.input as QInput;
    }

    async onInput() {
        if (!this.input) return this.reset();
        if (this.stopFilter) return this.stopFilter = false;

        if (this.currentProvider == null) {
            this.currentProvider = this.findProviderForInput(this.input);
            this.debounce = 500;
        }

        if (this.input.length > 3)
            await this.updateSuggestions(this.input);
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

    @Watch('modeMenuShoving')
    onModeMenuToggle() {
        if (!this.modeMenuShoving) return;
        this.$nextTick(() => {
            const el = (this.$refs.modeMenu as any).__portal.$el;
            el.style.boxShadow = 'none';
        });
    }

    @Emit('selected')
    async onSuggestionSelect(s: Suggestion) {
        this.suggestionsMenu.hide();
        this.stopFilter = true;
        this.input = s.text;
        const result = await this.currentProvider!.prepareResult(s);
        return result;
    }

    findProviderForInput(input: string) {
        let provider: ISuggestionProvider | null = null;

        this.providers.forEach(p => {
            if (p.isMatchByInput(input)) provider = p;
        })

        return provider;
    }

    setProvider(p: ISuggestionProvider | null) {
        if (p != this.currentProvider) this.reset();
        this.currentProvider = p;
    }

    reset() {
        this.input = '';
        this.suggestions = [];
        this.stopFilter = false;
        this.currentProvider = null;
        this.suggestionsMenu.hide();
        this.$emit('selected', null);
    }


    async updateSuggestions(input: string) {
        if (!this.currentProvider) return;

        let suggestions: Suggestion[] = [];
        try {
            suggestions = await this.currentProvider.getSuggestions(input);
        }
        catch (error) { }

        this.suggestions = suggestions;
        this.suggestionsMenu.show();
    }

    noop(e: MouseEvent) {
        return false;
    }
}