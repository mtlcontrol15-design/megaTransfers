export const setFormValue = (setForm, form, key, value) => {
  setForm({ ...form, [key]: value });
};

export const mapUserToForm = (user, prev) => {
  return {
    ...prev,
    fullName: user?.fullName || "",
    email: user?.email || "",
  };
};