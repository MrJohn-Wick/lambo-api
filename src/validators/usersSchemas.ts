export const schemaUserCreate = {
  "email" : {
    isEmail: true,
    notEmpty: true,
    errorMessage: "It is not valid email.",
  }
};
