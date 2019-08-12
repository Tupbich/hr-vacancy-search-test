<template>
    <q-item @click="emitSelect(suggestion)" clickable>
        <q-item-section>
            <q-item-label :class="{'text-accent': suggestion.isMatch}">
                <q-icon name="person_outline" size="22px" />
                {{ suggestion.text }}
            </q-item-label>
            <q-item-label caption v-if="suggestion.childs">
                вакансии:
                <span v-for="(ss,i) in suggestion.childs" :key="i"
                      :class="{'text-accent': ss.isMatch}">
                    {{ss.text}}</span>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { AbstractSuggestionRenderComponent } from "../AbstractSuggestionRenderComponent";

@Component
export default class VacancySuggestionComponent extends AbstractSuggestionRenderComponent {

}
</script>