export interface IGeoPoint {
    Lat: number,
    Lon: number;
}

export interface IHasGeo {
    GeoPoint: IGeoPoint;
}

export interface IShopVacancies extends IHasGeo {
    Address: string;
    Vacancies: IVacancy[];
}

export interface IVacancy {
    Profession: string;
}

export interface IAddressSuggestion {
    Full: string;
    Short: string;
}

export interface IAddress extends IHasGeo {
    Name: string;
    ShortName: string;
}

export interface IMetroLine {
    Name: string;
    HexColor: string;
    Stations: IMetroStation[];
}

export interface IMetroStation extends IHasGeo {
    Name: string;
    Line: IMetroLine
}