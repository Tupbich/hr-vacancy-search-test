import * as api from '@/api';
import { Circle } from 'leaflet';

interface ICoordinate {
    Lat: number;
    Lon: number;
}


abstract class SearchLocation {
    Name: string = "";
    Coordinates: ICoordinate | null = null;

    constructor(init?: Partial<SearchLocation>) {
        Object.assign(this, init);
    }
}

export class Address extends SearchLocation {
};

export class MetroLine {
    Name: string = "";
    Color: string = "";
    Stations: MetroStation[] = [];

    constructor(init?: Partial<MetroLine>) {
        Object.assign(this, init);
    }
};

export class MetroStation extends SearchLocation {
    Line!: MetroLine;
    constructor(init?: Partial<MetroStation>) {
        super();
        Object.assign(this, init);
    }
};

const getAddressSuggestions = async (input: string): Promise<string[]> => {
    const suggestions = await api.getSuggestions(input);
    return suggestions.map((s: any) => s.fullAddress);
};

const getAddress = async (address: string): Promise<Address> => {
    const coords = await api.getCoords(address);
    return new Address({
        Name: address,
        Coordinates: coords ? { Lat: coords.lat, Lon: coords.lon } : null
    });
};

const getMetroLines = async (nearPoint: ICoordinate, radius: number): Promise<MetroLine[]> => {
    const circle = new Circle([nearPoint.Lat, nearPoint.Lon], radius);
    const bounds = circle.getBounds();
    const nw = bounds.getNorthWest();
    const se = bounds.getSouthEast();
    const lines = await api.getMetroLines({ bounds: [[nw.lat, nw.lng], [se.lat, se.lng]] });

    const result = lines.map((l: any) => {
        const line = new MetroLine({
            Name: l.name,
            Color: l.hex_color
        });

        const stations = l.stations.map((s: any) =>
            new MetroStation({
                Name: s.name,
                Coordinates: { Lat: s.lat, Lon: s.lng },
                Line: line
            }));

        line.Stations = stations;
        return line;
    });

    return result;
};

export default {
    getAddressSuggestions,
    getAddress,
    getMetroLines
};
