const API = "https://stopper-service.safeapp.workers.dev/api";

function getFormattedDate() {
    let currentDate = new Date();
    return currentDate.toISOString().split("T")[0];
}

interface CreateDescriptor {
    partner_merchant_id?: string;
    partner_descriptor_id?: string;
    name?: string;
    applied_by?: string;
    status?: string;
    payment_descriptor: string;
    payment_descriptor_contact: string;
}

export async function createDescriptor({
    name,
    partner_merchant_id = "415439",
    partner_descriptor_id,
    payment_descriptor,
    payment_descriptor_contact,
}: CreateDescriptor) {
    const data = {
        partner_merchant_id,
        partner_descriptor_id: Math.round(Math.random() * 1000000).toString(), // generate this randomly
        name:
            "curiouslytech" +
            payment_descriptor +
            payment_descriptor_contact.slice(-4), // we will be using business name + descriptor + a few characters from contact as per vish latest update
        applied_by: "GATEWAY",
        payment_descriptor,
        payment_descriptor_contact,
        status: "ENABLED",
        start_date: getFormattedDate(),
    };

    return await fetch(`${API}/merchants/${partner_merchant_id}/descriptors`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

interface ListDescriptors {
    merchant_id: string;
}

export interface Descriptor {
    applied_by: string;
    created_at: number; // timestamp
    id: string;
    name: string;
    partner_descriptor_id: string;
    partner_merchant_id: string;
    payment_descriptor: string;
    payment_descriptor_contact: string;
    start_date: string; // 2025-01-17
    status: string;
    updated_at: number; // timestamp
    verifi_id: string;
    verifi_location: string;
}

export async function listDescriptors({
    merchant_id,
}: ListDescriptors): Promise<Descriptor[]> {
    const req = await fetch(`${API}/merchants/${merchant_id}/descriptors`, {
        method: "GET",
    });

    const jsonRes = await req.json();

    return jsonRes.data as Descriptor[];
}

export async function updateDescriptor({
    name,
    partner_merchant_id,
    partner_descriptor_id,
    payment_descriptor,
    payment_descriptor_contact,
    status,
}: Partial<CreateDescriptor>): Promise<Descriptor> {
    const data = {
        // name,
        partner_merchant_id,
        partner_descriptor_id,
        // payment_descriptor,
        // payment_descriptor_contact,
        status,
    };

    const res = await fetch(
        `${API}/merchants/${partner_merchant_id}/descriptors/${partner_descriptor_id}`,
        {
            method: "PUT",
            body: JSON.stringify(data),
        }
    );

    return (await res.json()).data.descriptor as Descriptor;
}
