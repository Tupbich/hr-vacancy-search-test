<template>
    <q-select v-model="selected" use-input input-debounce="300" spellcheck="false" filled fill-input hide-selected
              option-value="text" option-label="text" :options="suggestions" @keyup.esc.native="reset" ref="select"
              @filter="onSearchTyping" square dark dense standout="bg-primary text-white">
        <template v-slot:prepend>
            <q-icon class="text-white" :name="suggestionsIcon" />
        </template>

        <template v-slot:option="scope">
            <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">

                <template v-if="mode=='address'">
                    <q-item-section>
                        <q-item-label>{{ scope.opt.text }}</q-item-label>
                    </q-item-section>
                </template>

                <template v-if="mode=='metroLine'">
                    <q-item-section>
                        <q-item-label :class="{'text-accent': containsInInput(scope.opt.obj.Name)}">
                            <q-icon :name="suggestionsIcon" /> линия {{ scope.opt.text }}
                        </q-item-label>
                        <q-item-label caption>
                            станции:
                            <q-chip v-for="s in scope.opt.obj.Stations" :key="s.Name" class="metro-station"
                                    :color="containsInInput(s.Name)?'accent':'primary'" text-color="white" dense outline
                                    clickable @click.stop="onMetroStationClick(s)">
                                {{s.Name}}</q-chip>
                        </q-item-label>
                    </q-item-section>

                </template>
            </q-item>
        </template>

        <template v-slot:append>
            <q-btn @click="reset" dense flat round v-show="selected">
                <q-icon class="text-white" name="clear" />
            </q-btn>
        </template>
    </q-select>
</template>

<script lang="ts" src="./Search.ts" />
