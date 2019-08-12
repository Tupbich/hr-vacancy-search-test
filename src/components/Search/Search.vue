<template>
    <div>
        <q-input filled square dark dense standout="bg-primary text-white" v-model="input"
                 :debounce="debounce" @input="onInput" spellcheck="false" @focus="onFocus"
                 ref="input" @blur="onBlur" @click="onClick" @keyup.esc="reset">
            <template v-slot:prepend>
                <q-btn :icon="currentProvider?currentProvider.icon:'search'"
                       :icon-right="modeMenuShoving?'keyboard_arrow_up':'keyboard_arrow_down'"
                       @click.stop="noop" rounded flat dense>
                    <q-menu v-model="modeMenuShoving" anchor="bottom left" self="top left"
                            ref="modeMenu" :offset="[0,16]" style="border:none; box-shadow:none"
                            auto-close content-class="bg-transparent" transition-show="jump-down"
                            transition-hide="jump-up">
                        <div class="column">
                            <q-btn dense round class="bg-primary q-mb-xs" v-for="(p,i) in providers"
                                   :key="i" @click="setProvider(p)">
                                <q-icon class="text-white" :name="p.icon" />
                                <q-tooltip anchor="center right" self="center left">
                                    <div class="text-subtitle2">{{p.description}}</div>
                                </q-tooltip>
                            </q-btn>

                            <q-btn dense round class="bg-primary q-mb-xs"
                                   @click="setProvider(null)">
                                <q-icon class="text-white" name="search" />
                                <q-tooltip anchor="center right" self="center left">
                                    <div class="text-subtitle2">сбросить</div>
                                </q-tooltip>
                            </q-btn>

                        </div>
                    </q-menu>
                </q-btn>
            </template>
            <template v-slot:append>
                <q-btn v-if="!loading && input" dense flat round @click="reset">
                    <q-icon class="text-white" name="clear" />
                </q-btn>
                <q-spinner v-if="loading" color="white" size="1.2em" :thickness="4" />
            </template>
        </q-input>

        <q-menu square fit max-height="300px" no-parent-event no-focus :value="showSuggestions"
                ref="suggestionsMenu">
            <q-list v-if="currentProvider">
                <component :is="currentProvider.renderComponent" v-for="(s,i) in suggestions"
                           :key="i" :input="input" :suggestion="s" @select="onSuggestionSelect" />
            </q-list>
        </q-menu>

    </div>
</template>

<script lang="ts" src="./Search.ts" />
