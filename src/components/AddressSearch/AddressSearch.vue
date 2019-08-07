<template>
    <q-select filled v-model="selectedAddress" use-input input-debounce="300" spellcheck="false" fill-input hide-selected 
              :options="suggestions" option-value="fullAddress" option-label="fullAddress" @keyup.esc.native="clear" ref="select"
              @filter="onTyping" square dark dense standout="bg-primary text-white">
        <template v-slot:prepend>
            <q-icon class="text-white" name="search" />
        </template>
        <!-- <template v-slot:selected-item>
            <span></span>
        </template> -->
        <template v-slot:append>
            <q-btn @click="clear" flat round v-show="selectedAddress">
                <q-icon class="text-white" name="clear" />
            </q-btn>
        </template>
    </q-select>
</template>

<script lang="ts" src="./AddressSearch.ts" />