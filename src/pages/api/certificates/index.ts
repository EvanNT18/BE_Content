import { supabase } from "@/lib/SupabaseClient";
import Joi from "joi";
import { NextApiRequest, NextApiResponse } from "next";

const validator = Joi.object({
    user_id: Joi.required(),
    course_id: Joi.required(),
});

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {

    if (req.method !== `POST`) {
        return res.status(405).json({ message: `Method not allowed` });
    }

    // TODO: Check if user completed the course

    let certificateData = validator.validate(req.body || {});
    if (certificateData.error) {
        return res.status(422).json({ message: certificateData.error.details[0].message });
    }

    certificateData = certificateData.value;
    const { error } = await supabase.from('certificates').insert(certificateData);
    if (error) {
        return res.status(500).json({ message: error.message });
    }

    return res.status(200).json({
        message: "Sertifikat berhasil dibuat",
    });
}