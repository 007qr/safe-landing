export default class Tracker {
    private userId: number;
    private sessionId: number;
    private siteId: string;
    private sessionTimeout: number;
    private lastActivity = Date.now();

    constructor(site_id: string) {
        this.userId = this.generateUserId();
        this.sessionId = this.generateSessionId();
        this.siteId = site_id;
        this.sessionTimeout = 30 * 60 * 1000;

        // this.setupEventListeners();
        this.checkSessionExpiration();
    }

    private simpleHash(str: string): number {
        try {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = (hash << 5) - hash + char;
                hash |= 0;
            }
            return Math.abs(hash);
        } catch (error) {
            console.error('Error in simpleHash:', error);
            return Math.floor(Math.random() * 1_000_000);
        }
    }

    private getCurrentDate(): string {
        try {
            const today = new Date();
            return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        } catch (error) {
            console.error("Error in getCurrentDate:", error);
            return "1970-01-01";
        }
    }

    private generateId(): number {
        const rand = crypto.getRandomValues(new Uint32Array(2));
        return Number((BigInt(rand[0]) << 32n) | BigInt(rand[1]) % BigInt(Number.MAX_SAFE_INTEGER));
    }

    private getThirtyMinuteWindow(): string {
        try {
            const now = new Date();
            const minutes = Math.floor(now.getMinutes() / 30) * 30;
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, "0");
            const day = String(now.getDate()).padStart(2, "0");
            const hours = String(now.getHours()).padStart(2, "0");
            const roundedMinutes = String(minutes).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${roundedMinutes}`;
        } catch (error) {
            console.error("Error in getThirtyMinuteWindow:", error);
            return "1970-01-01T00:00";
        }
    }

    private generateUserId(): number {
        try {
            const userAgent = navigator.userAgent || "unknown";
            const dailySalt = this.getCurrentDate();
            const rawString = `${userAgent}:${dailySalt}`;
            return this.simpleHash(rawString);
        } catch (error) {
            console.error("Error generating user_id:", error);
            return this.generateId();
        }
    }

    private generateSessionId(): number {
        try {
            const userAgent = navigator.userAgent || "unknown";
            const timeWindow = this.getThirtyMinuteWindow();
            const rawString = `${userAgent}:${timeWindow}:session`;
            return this.simpleHash(rawString);
        } catch (error) {
            console.error("Error generating session_id:", error);
            return this.generateId();
        }
    }

    private checkSessionExpiration() {
        try {
            setInterval(() => {
                const now = Date.now();
                if (now - this.lastActivity > this.sessionTimeout) {
                    this.sessionId = this.generateSessionId();
                    console.log("Session expired, new session_id:", this.sessionId);
                }
            }, 60 * 1000);
        } catch (error) {
            console.error("Error in checkSessionExpiration:", error);
        }
    }

    private updateActivity() {
        try {
            this.lastActivity = Date.now();
        } catch (error) {
            console.error("Error in updateActivity:", error);
        }
    }

    private createSession() {
        const utmParams = Tracker.getUTMParams();

        const data = {
            sign: 1,
            start: new Date().toISOString(),
            user_id: this.userId,
            session_id: this.sessionId,
            timestamp: new Date().toISOString(),
            campaign_id: utmParams.campaign_id,
            adset_id: utmParams.adset_id,
            ad_id: utmParams.ad_id,
            utm_source: utmParams.utm_source,
            landing_page_id: this.siteId,
        };

        // data['sign'] = -1
        // this.fetchSession(data);
        data['sign'] = 1
        this.fetchSession(data);


    }

    private fetchSession(data: Object) {
        fetch("https://user-tracking-worker.aayushpatil558321.workers.dev", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => console.log(result))
            .catch((error) => console.error("Error creating a session:", error));
    }

    public static getUTMParams() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get("utm_source"),
            utm_medium: params.get("utm_medium"),
            campaign_id: params.get("utm_campaign"),
            adset_id: params.get("utm_term"),
            ad_id: params.get("utm_content"),
        };
    }

    public trackEvent(event_name: string, meta_key: string[], meta_value: string[]) {
        const utmParams = Tracker.getUTMParams();

        const data = {
            timestamp: new Date().toISOString(),
            user_id: this.userId,
            // session_id: this.sessionId,
            event_name,
            campaign_id: utmParams.campaign_id,
            adset_id: utmParams.adset_id,
            ad_id: utmParams.ad_id,
            utm_source: utmParams.utm_source,
            landing_page_id: this.siteId,
            meta_key,
            meta_value,
        };

        fetch("https://user-tracking-worker.aayushpatil558321.workers.dev/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then((res) => res.json())
            .then((result) => console.log(result))
            .catch((error) =>
                console.error(`Error tracking event (${event_name}):`, error)
            );
    }

    private setupEventListeners() {
        try {
            window.addEventListener("load", () => {
                this.createSession();
                this.updateActivity();
            });
        } catch (e) {
            console.error("Error initializing tracker: ", e);
        }
    }
}
