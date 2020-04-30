import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string(),
      price: Yup.number(),
      money: Yup.mixed().oneOf([
        'BRL',
        // , 'USD', 'EUR'
      ]),
      description: Yup.string(),
      nutritional_profiles: Yup.array(Yup.string()),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails.', messages: err.inner });
  }
};
