<template>
    <l-layer-group>

        <l-polyline :lat-lngs="points" :color="color" :smooth-factor="0.5" :weight="4"
                    :opacity="opacity*0.8">
            <l-tooltip :options="{sticky:true}">
                <div>линия: {{metroLine.Name}}</div>
            </l-tooltip>
        </l-polyline>

        <l-circle-marker v-for="s in metroLine.Stations" :key="s.Name" :radius="4"
                         :lat-lng="[s.GeoPoint.Lat, s.GeoPoint.Lon]" :fill="true" :color="color"
                         :opacity="opacity*0.8" :fill-color="color" :fill-opacity="opacity*0.8">
            <l-tooltip>
                <div>станция: {{s.Name}}</div>
            </l-tooltip>
        </l-circle-marker>
    </l-layer-group>
</template>

<script lang="ts" src="./MetroLineMarker.ts" />