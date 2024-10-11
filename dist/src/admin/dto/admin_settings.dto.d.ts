declare enum Languages {
    ENGLISH = "English",
    SPANISH = "Spanish",
    FRENCH = "French",
    HINDI = "Hindi"
}
declare enum TimeZones {
    IST = "IST",
    EST = "EST",
    CST = "CST",
    PST = "PST",
    UTC = "UTC"
}
export declare class AdminSettingDto {
    siteTitle?: string;
    metaDescription?: string;
    logoImage?: string;
    defaultLanguage?: Languages;
    defaultTimeZone?: TimeZones;
    useSEOFriendlyUrls?: boolean;
    discourageSearchEngines?: boolean;
    maintainenceMode?: boolean;
    maintainenceMessage?: string;
    euCookieNotification?: boolean;
    analyticsTrackingCode?: string;
}
export declare class ResponseAdminSettingsDto {
    setting: AdminSettingDto;
}
export {};
