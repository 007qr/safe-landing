export type AdData = {
    timestamp: string;
    email: string;
    phone: string;
    campaign_id: string;
    adset_id: string;
    ad_id: string;
    utm_source: string;
    landing_page_id: string;
};


export type Events = {
	timestamp: string;
	event_name: string;
	campaign_id: string;
	adset_id: string;
	ad_id: string;
	utm_source: string;
	landing_page_id: string;
	email: string;
	phone: string;
	clicks: number;
};



export type GridLayout = {
    width: number;
    height: number;
    data: Array<number>;
};

export type Block = {
    width: number;
    height: number;
};

/**
 *
 *  email: string;
    utm_source: string;
    created_time: string;
    ad_id: string;
    ad_name: string;
    adset_id: string;
    adset_name: string;
    campaign_id: string;
    campaign_name: string;
    form_id: string;
    form_name: string;
    is_organic: string;
    platform: string;
    utm_medium: string;
    link_click_time: string;
    app_install_time: string;
    lp_id: string;
    lp_name: string;
    utm_campaign: string;
    subid1: string;
    subid2: string;
    subid3: string;
 */
