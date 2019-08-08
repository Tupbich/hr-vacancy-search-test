<template>
    <div>
        <q-input filled square dark dense standout="bg-primary text-white" v-model="input" :debounce="debounce"
                 @input="onInput" spellcheck="false" @focus="onFocus" @blur="onBlur" @click="onClick"
                 @keyup.esc="reset">
            <template v-slot:prepend>
                <q-icon class="text-white" :name="modeIcon" />
            </template>
            <template v-slot:append>
                <q-btn v-if="!loading && input" dense flat round @click="reset">
                    <q-icon class="text-white" name="clear" />
                </q-btn>
                <q-spinner v-if="loading" color="white" size="1.2em" :thickness="4" />
            </template>
        </q-input>

        <q-menu square fit max-height="300px" no-parent-event no-focus :value="showSuggestions" ref="suggestionsMenu">
            <q-list>
                <q-item clickable v-for="(s,i) in suggestions" :key="i" style="padding-left:13px"
                        @click="onSuggestionClick(s)">

                    <template v-if="mode=='address'">
                        <q-item-section>
                            <q-item-label>{{ s.text }}</q-item-label>
                        </q-item-section>
                    </template>

                    <template v-if="mode=='metro'">
                        <q-item-section>
                            <q-item-label :class="{'text-accent': containsInInput(s.text)}">
                                <q-icon :name="modeIcon" size="22px" :style="{'color': '#'+s.obj.HexColor}" />
                                линия {{ s.text }}
                            </q-item-label>
                            <q-item-label caption v-if="s.childs">
                                станции:
                                <q-chip v-for="ss in s.childs" :key="ss.text" class="metro-station"
                                        :color="containsInInput(ss.text)?'accent':'primary'" text-color="white" dense
                                        outline clickable @click.stop="onSuggestionClick(ss)">
                                    {{ss.text}}</q-chip>
                            </q-item-label>
                        </q-item-section>

                    </template>

                </q-item>
            </q-list>
        </q-menu>

    </div>
</template>

<script lang="ts" src="./Search.ts" />
