export interface Database {
    papers:  Paper[];
    modules: Module[];
}

export interface Module {
    cmid:  number;
    name:  string;
    units: Unit[];
}

export interface Unit {
    cuid:   number;
    name:   string;
    skills: Skill[];
}

export interface Skill {
    skid:      number;
    name:      string;
    publicid:  number;
    subskills: SkillSubskill[];
}

export interface SkillSubskill {
    ssid:   number;
    name:   string;
    letter: Mix | null;
    type:   Mix;
}

export enum Mix {
    A = "a",
    B = "b",
    C = "c",
    D = "d",
    E = "e",
    F = "f",
    G = "g",
    H = "h",
    I = "i",
    J = "j",
    K = "k",
    L = "l",
    M = "m",
    N = "n",
    O = "o",
    P = "p",
    Q = "q",
    R = "r",
    S = "s",
    T = "t",
    U = "u",
    V = "v",
    W = "w",
    X = "x",
    Y = "y",
    Z = "z",
}

export interface Paper {
    type:           PaperType;
    name:           string;
    wdid:           null;
    description:    null;
    wid:            number;
    parent:         number;
    uid:            number;
    authorName:     PaperAuthorName;
    numquestions:   number;
    totalmarks:     number | null;
    views:          number | null;
    d:              number;
    notes:          null;
    mix:            Mix;
    questions:      Question[];
    allqswithmarks: boolean;
    _subskills:     SubskillElement[];
    sid:            number;
    acid:           null;
    status:         number;
}

export interface SubskillElement {
    ssid:         number;
    skid:         number | null;
    type:         Mix;
    name:         string;
    video:        null | string;
    videolength:  number | null;
    letter:       Mix | null;
    data?:        null;
    lastmodified: number | null;
    created:      number | null;
    active:       boolean | null;
    difficulty:   number | null;
    legacyid:     number | null;
    publicid:     number;
}

export enum PaperAuthorName {
    Edexcel = " Edexcel",
    JamieFrost = "Jamie Frost",
    UKMathematicsTrust = " UK Mathematics Trust",
}

export interface Question {
    qid:               number;
    uid:               number | null;
    authorName:        QuestionAuthorName;
    difficulty:        number | null;
    calc:              number | null;
    content:           string;
    response:          string;
    answer:            Answer;
    usagecount:        number | null;
    datecreated:       number | null;
    datemodified:      number | null;
    numcorrect:        number | null;
    accuracy:          null | string;
    status:            number;
    locked:            boolean | null;
    reason:            null | string;
    marks:             number | null;
    useMarks:          boolean | null;
    img:               null | string;
    invertimg:         null | string;
    partlink:          number | null;
    coid:              number | null;
    qualificationName: QualificationName | null;
    _answerMarker:     null;
    skillscache:       number[] | null;
    keyskill:          number | null;
    subskill:          SubskillElement | null;
    classified:        boolean | null;
    firstname:         null;
    surname:           null;
    isExamBoard?:      boolean;
    _allParts?:        number[];
}

export interface Answer {
    type:          AnswerType | null;
    data:          Data | null;
    correctAnswer: Array<Array<PurpleCorrectAnswer | string> | FluffyCorrectAnswer | number | string> | TentacledCorrectAnswer | number | null;
}

export interface PurpleCorrectAnswer {
    operator: Op;
    answer:   string;
}

export enum Op {
    Empty = "=",
    Fluffy = "<",
    Hilarious = "<=<=",
    Indecent = "<<=",
    Indigo = "<<",
    Op = ">",
    Purple = ">=",
    Sticky = "<=<",
    Tentacled = "<=",
}

export interface FluffyCorrectAnswer {
    exact?: string;
    from?:  string;
    to?:    string;
    op?:    Op;
    args?:  string[];
    var?:   string;
    x?:     number | null;
    y?:     number | null;
}

export interface TentacledCorrectAnswer {
    main?:        string;
    power?:       string;
    x?:           string;
    y?:           string;
    numer?:       number;
    denom?:       number;
    whole?:       number;
    alternative?: string;
    points?:      Point[];
    type?:        CorrectAnswerType;
    v?:           number;
}

export interface Point {
    x: number;
    y: number;
}

export enum CorrectAnswerType {
    List = "list",
    Mixed = "mixed",
    Multiline = "multiline",
    Nonmixed = "nonmixed",
    Numeric = "numeric",
    Rectangle = "rectangle",
    Textual = "textual",
}

export interface Data {
    equivalence?:     Equivalence;
    before?:          string;
    after?:           After;
    options?:         string[];
    multiple?:        boolean;
    rows?:            Row[] | number;
    ordered?:         boolean;
    numSlns?:         number;
    vars?:            string[];
    isInequality?:    boolean;
    connector?:       Connector;
    accuracy?:        Accuracy;
    anyorder?:        boolean;
    num?:             number;
    dimensions?:      number;
    mode?:            Mode;
    xaxis?:           Axis;
    nonanswershapes?: Nonanswershape[];
    tolerance?:       number;
    type?:            CorrectAnswerType;
    simplestForm?:    boolean;
    fixedVals?:       Array<string[]>;
    cols?:            number;
    yaxis?:           Axis;
    order?:           number;
    submode?:         Submode | null;
    numpoints?:       number;
    toleranceX?:      number;
    toleranceY?:      number;
    items?:           string[];
    bars?:            Bar[];
    nonAnswerShapes?: NonAnswerShape[];
    grid?:            Grid;
}

export enum Accuracy {
    Awrt = "awrt",
    Exact = "exact",
    Range = "range",
}

export enum After {
    After = "%",
    AfterMM2M = "[m]m^2[/m]",
    CM = "cm",
    CMM2M = "cm[m]^2[/m]",
    CMM3M = "cm[m]^3[/m]",
    CirclesWouldCompleteThePictogram = "circles would complete the pictogram.",
    Empty = "",
    Hours = "hours",
    KM = "km",
    KMM2M = "km[m]^2[/m]",
    KMM3M = "km[m]^3[/m]",
    Kg = "kg",
    LitreS = "litre(s)",
    Litres = "litres",
    M0M = "[m]=0[/m]",
    M230M = "[m]=230[/m]",
    M25M = "[m]=25[/m]",
    MCM2M = "[m]cm^2[/m]",
    MCircM = "[m]^{\\circ}[/m]",
    MCircMC = "[m]^\\circ[/m]C",
    MLeftTextbfA2TextbfBRightM = "[m]\\left(\\textbf{a}+2\\textbf{b}\\right)[/m]",
    MM2M = "m[m]^2[/m]",
    MS = "m/s",
    MVecABM = "[m]\\vec{AB}[/m]",
    MVecAEM = "[m]\\vec{AE}[/m]",
    MVecANThereforeMMAGNMIsAStraightLine = "[m]\\vec{AN}\\therefore[/m] [m]AGN[/m] is a straight line",
    MVecCAM = "[m]\\vec{CA}[/m]",
    MVecCDM = "[m]\\vec{CD}[/m]",
    MVecDPM = "[m]\\vec{DP}[/m]",
    MVecEYM = "[m]\\vec{EY}[/m]",
    MVecOPM = "[m]\\vec{OP}[/m]",
    MVecPQM = "[m]\\vec{PQ}[/m]",
    Metres = "metres",
    Miles = "miles",
    MilesPerHour = "miles per hour",
    Molecules = "molecules",
    Purple = "}",
    Seconds = "seconds",
    SquareKilometres = "square kilometres",
    Tins = "tins",
    Unit = "unit",
    UnitM2M = "unit[m]^2[/m]",
    UnitS = "unit(s)",
    Units = "units",
    UnitsM2M = "units[m]^2[/m]",
}

export interface Bar {
    label:      string;
    color?:     string;
    frequency?: number;
}

export enum Connector {
    And = "and",
    Or = "or",
}

export enum Equivalence {
    Equiv = "equiv",
    Strict = "strict",
    Struc = "struc",
}

export interface Grid {
    xaxis: Xaxis;
    yaxis: Yaxis;
    mode:  string;
    v:     number;
}

export interface Xaxis {
    label:  string;
    type:   string;
    values: string;
}

export interface Yaxis {
    type:  CorrectAnswerType;
    label: string;
    from:  string;
    to:    string;
}

export enum Mode {
    Barchart = "barchart",
    Boxplot = "boxplot",
    Geometric = "geometric",
    Polynomial = "polynomial",
}

export interface NonAnswerShape {
    points: Point[];
    type:   CorrectAnswerType;
}

export interface Nonanswershape {
    latex:      string;
    color?:     Color;
    label?:     Label;
    showLabel?: boolean;
    hidden?:    boolean;
    lines?:     boolean;
    points?:    boolean;
}

export enum Color {
    Black = "black",
    Blue = "blue",
    Brown = "brown",
    ColorBlack = "Black",
    ColorBlue = "Blue",
    ColorGrey = "grey",
    Green = "green",
    Grey = "Grey",
    Orange = "orange",
    Purple = "purple",
    Red = "red",
    White = "white",
}

export enum Label {
    A = "A",
    B = "B",
    C = "C",
    D = "D",
    E = "E",
    Empty = " ",
    Mirror = "mirror",
    MirrorLine = "mirror line",
    O = "O",
    P = "P",
    X = "X",
}

export interface Row {
    before:    string;
    after:     string;
    accuracy?: Accuracy;
    match?:    Match;
}

export enum Match {
    Contains = "contains",
    Exactly = "exactly",
}

export enum Submode {
    Multiline = "multiline",
    Points = "points",
    Polygon = "polygon",
}

export interface Axis {
    from?: number;
    to?:   number;
    label: string;
    step?: number;
}

export enum AnswerType {
    Coordinate = "coordinate",
    Desmos = "desmos",
    Eqnsolutions = "eqnsolutions",
    Expression = "expression",
    Fraction = "fraction",
    Inequality = "inequality",
    List = "list",
    Multiplechoice = "multiplechoice",
    Numeric = "numeric",
    Ordered = "ordered",
    Ratio = "ratio",
    Shape = "shape",
    Standardform = "standardform",
    Table = "table",
    Textual = "textual",
    Vector = "vector",
}

export enum QuestionAuthorName {
    Aqa = "AQA",
    Edexcel = "Edexcel",
    None = "None",
    UKMathematicsTrust = "UK Mathematics Trust",
}

export enum QualificationName {
    FunctionalSkillsMathematicsEntryLevel1 = "Functional Skills Mathematics Entry Level 1",
    GCSE91MathematicsFoundation = "GCSE (9-1) Mathematics (Foundation)",
    GCSE91MathematicsHigher = "GCSE (9-1) Mathematics (Higher)",
    GCSEFoundation = "GCSE Foundation",
    GCSEHigher = "GCSE Higher",
    GCSEIntermediate = "GCSE Intermediate",
    GCSEMathematicsFoundation = "GCSE Mathematics (Foundation)",
    GCSEStatisticsFoundation = "GCSE Statistics (Foundation)",
    IGCSEFoundation = "IGCSE Foundation",
    IGCSEHigher = "IGCSE Higher",
    IGCSEMathematicsAFoundation = "IGCSE Mathematics A (Foundation)",
    IGCSEMathematicsAHigher = "IGCSE Mathematics A (Higher)",
    IGCSEMathematicsAModularHigher = "IGCSE Mathematics A Modular (Higher)",
    IntermediateKangaroo = "Intermediate Kangaroo",
    IntermediateMathsChallenge = "Intermediate Maths Challenge",
    IntermediateMathsOlympiad = "Intermediate Maths Olympiad",
    JuniorKangaroo = "Junior Kangaroo",
    JuniorMathsChallenge = "Junior Maths Challenge",
    JuniorMathsOlympiad = "Junior Maths Olympiad",
    SeniorKangaroo = "Senior Kangaroo",
    SeniorMathsChallenge = "Senior Maths Challenge",
}

export enum PaperType {
    Worksheet = "worksheet",
}
