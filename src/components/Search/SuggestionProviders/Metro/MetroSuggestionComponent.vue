<template>
    <q-item @click="emitSelect(suggestion)" clickable>
        <q-item-label>
            <q-item-label>
                <q-icon name="subway" size="22px" :class="{'text-accent': suggestion.isMatch}"
                        :style="{'color': '#'+suggestion.obj.HexColor}" />
                линия {{ suggestion.text }}
            </q-item-label>
            <q-item-label caption v-if="suggestion.childs">
                станции:
                <q-chip v-for="ss in suggestion.childs" :key="ss.text" dense
                        :color="ss.isMatch?'accent':'primary'" text-color="white" outline clickable
                        @click="emitSelect(ss)">
                    {{ss.text}}</q-chip>
            </q-item-label>
        </q-item-label>
    </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from "vue-property-decorator";
import { AbstractSuggestionRenderComponent } from '../AbstractSuggestionRenderComponent';
import { Suggestion } from '../..';

@Component
export default class MetroSuggestionComponent extends AbstractSuggestionRenderComponent {

}
</script>