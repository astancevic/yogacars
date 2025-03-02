export interface APIVehicle {
    vin: string;
    sellingPrice: number;
    dateInStock: Date;
    dealerCity: string;
    dealerState: string;
    mileage: number;
    trim: string;
    year: number;
    type: string;
    make_name: string;
    model_name: string;
    image_url: string;
}

export interface APIMake {
    __typename?: 'Make';
    name: string;
}

export interface APIModel {
    __typename?: 'Model';
    name: string;
    makeName?: string;
}

export interface FilterVehiclesAPIResponse {
    vehicles: APIVehicle[];
    aggregateVehicle: {
        __typename?: 'AggregateVehicle';
        _count: {
            _all: number;
        };
    };
    // allMake: (string | null)[];
    // allModel: (string | null)[];
    // trim: (string | null)[];
    // location: (string | null)[];
    // bodyType: (string | null)[];
    // fuelType: (string | null)[];
    // drivetrain: (string | null)[];
}

export type RangeLimits = [min: number, max: number];

export interface FilterGraphQueryVariables {
    where: {
        sellingPrice?: RangeOperator;
        make?: IsNameEqualsOperator;
        model?: IsNameEqualsOperator;
        dealerCity?: InOperator;
        miles?: RangeOperator;
        year?: RangeOperator;
        fuelType?: InOperator;
        bodyType?: InOperator;
        transmission?: InOperator;
        drivetrain?: InOperator;
        trim?: InOperator;
        extColorGeneric?: InOperator;
        intColorGeneric?: InOperator;
        type?: InOperator;
        dealerNetwork?: EqualOperator;
    };
    whereTrim: {
        make?: IsNameEqualsOperator;
        model?: IsNameEqualsOperator;
        dealerNetwork?: EqualOperator;
    };
    orderBy?: Record<string, 'asc' | 'desc'>[] | Record<string, { sort: 'asc' | 'desc' }>[];
    take?: number;
    skip?: number;
}

export type InOperator = { in: string[] };
export type RangeOperator = { gte?: number; lte?: number };
export type IsNameEqualsOperator = { is: { name: InOperator } };
export type EqualOperator = { equals: string };

export interface ListLikeItem {
    readonly name: string | null;
}
export interface modelListLikeItem {
    readonly name: string | null;
    readonly makeName?: string | null;
    // readonly modelName?: string | null;
}

export interface trimsQueryResponse {
    trim: {
        name: string;
        model: {
            name: string;
        };
    }[];
}

export type filterKeys =
    | 'price'
    | 'make'
    | 'model'
    | 'location'
    | 'trim'
    | 'fuelType'
    | 'drivetrain'
    | 'miles'
    | 'year'
    | 'bodyType'
    | 'exteriorColor'
    | 'interiorColor'
    | 'type';
