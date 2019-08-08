<template>
    <l-layer-group>
        <l-circle :lat-lng="point" color="" fill-color="#42A5F5" :radius="radius" />
        <l-marker :lat-lng="point">
            <l-icon>
                <q-icon color="primary" size="12px" name="my_location" />
            </l-icon>
        </l-marker>
    </l-layer-group>

</template>

<script lang="ts" src="./AddressMarker.ts" />