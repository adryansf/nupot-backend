import * as Yup from 'yup';

export default async (req, res, next) => {
  try {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      price: Yup.number().required(),
      money: Yup.mixed()
        .oneOf([
          'BRL',
          // , 'USD', 'EUR'
        ])
        .required(),
      description: Yup.string(),
      nutritional_profiles: Yup.array(Yup.string()).required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    return next();
  } catch (err) {
    return res
      .status(400)
      .json({ error: 'Validation fails.', messages: err.inner });
  }
};
