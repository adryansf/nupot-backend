import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      page: Yup.string(),
      nutritional_profile: Yup.string(),
      name: Yup.string(),
    });

    await schema.validate(req.query, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails.', messages: err.inner });
  }
};
