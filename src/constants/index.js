import { NumericInput, InputGroup, TextArea } from "formik-blueprint";
import * as Yup from "yup";
import moment from "moment";
import DatePicker from "components/datepicker";
import RadioInput from "components/radioinput";

export const DATE_FORMAT = "YYYY/MM/DD";

export const RECORD_FIELDS = {
  hour: {
    label: "Hour",
    form_label: "Hour",
    placeholder: "Hour (required)",
    id: "hour",
    type: "text",
    name: "hour",
    component: NumericInput,
    validate: Yup.number()
      .notOneOf([0], "Hour must be over 0!")
      .min(0, "Hour must be over 0!")
      .max(24, "Hour must be less than 24!")
      .required("Required"),
    initialValue: 0
  },
  note: {
    label: "Note",
    form_label: "Note",
    placeholder: "Note (required)",
    id: "note",
    type: "text",
    name: "note",
    component: TextArea,
    validate: Yup.string().required("Required"),
    initialValue: "",
    fill: true
  },
  date: {
    label: "Date",
    form_label: "Date",
    id: "date",
    component: DatePicker,
    type: "date",
    name: "date",
    formatDate: date => {
      return moment(date).format(DATE_FORMAT);
    },
    parseDate: str => {
      return new Date(str);
    },
    placeholder: DATE_FORMAT,
    maxDate: new Date(),
    canClearSelection: false,
    initialValue: new Date()
  }
};

export const USER_FIELDS = {
  firstName: {
    label: "First Name",
    form_label: "First Name",
    placeholder: "First Name (Required)",
    id: "firstName",
    type: "text",
    name: "firstName",
    component: InputGroup,
    validate: Yup.string().required("Required"),
    initialValue: "",
    large: true
  },
  lastName: {
    label: "Last Name",
    form_label: "Last Name",
    placeholder: "Last Name (Required)",
    id: "lastName",
    type: "text",
    name: "lastName",
    component: InputGroup,
    validate: Yup.string().required("Required"),
    initialValue: "",
    large: true
  },
  email: {
    label: "Email Address",
    form_label: "Email Address",
    placeholder: "Email (Required)",
    id: "email",
    type: "email",
    name: "email",
    component: InputGroup,
    validate: Yup.string()
      .email("Invalid email")
      .required("Required"),
    initialValue: "",
    large: true
  },
  password: {
    label: "Password",
    form_label: "Password",
    placeholder: "Password (Required)",
    id: "password",
    type: "password",
    name: "password",
    component: InputGroup,
    validate: Yup.string()
      .min(8, "Length must be at least 8 letters!")
      .max(50, "Length must be less than 50 letters!")
      .required("Required"),
    initialValue: "",
    large: true
  },
  passwordConfirm: {
    label: "Confirm Password",
    form_label: "Confirm Password",
    placeholder: "Password (Required)",
    id: "passwordConfirm",
    type: "password",
    name: "passwordConfirm",
    component: InputGroup,
    validate: Yup.string()
      .when("password", {
        is: val => (val && val.length > 0 ? true : false),
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Both password need to be the same"
        )
      })
      .min(8, "Length must be at least 8 letters!")
      .max(50, "Length must be less than 50 letters!")
      .required("Required"),
    initialValue: "",
    large: true
  },
  role: {
    label: "Role",
    form_label: null,
    placeholder: "Role (Required)",
    id: "role",
    type: "text",
    name: "role",
    component: RadioInput,
    validate: null,
    initialValue: 0,
    inline: true
  },
  preferredWorkingHours: {
    label: "Preferred Working Hours",
    form_label: "Preferred Working Hours",
    placeholder: "Preferred Working Hours (required)",
    id: "preferredWorkingHours",
    type: "text",
    name: "preferredWorkingHours",
    component: NumericInput,
    validate: Yup.number()
      .notOneOf([0], "Hour must be over 0!")
      .min(0, "Hour must be over 0!")
      .max(24, "Hour must be less than 24!")
      .required("Required"),
    initialValue: 0
  }
};

export const ROLES = {
  USER: 0,
  MANAGER: 1,
  ADMIN: 2
};
