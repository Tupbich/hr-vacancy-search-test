import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { Suggestion } from '../index';

@Component
export class AbstractSuggestionRenderComponent extends Vue {
    @Prop()
    suggestion!: Suggestion;

    @Prop()
    input!: string;

    emitSelect(s?: Suggestion) {
        this.$emit('select', s || this.suggestion);
    }
}
