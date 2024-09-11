import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// Validation schemas for each step
const personalDetailsSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
});

const addressDetailsSchema = yup.object().shape({
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  postalCode: yup
    .string()
    .matches(/^\d{5,6}$/, "Postal code must be 5 or 6 digits")
    .required("Postal code is required"),
});

const paymentDetailsSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, "Card number must be exactly 16 digits")
    .required("Card number is required"),
  expiryDate: yup
    .string()
    .matches(
      /^(0[1-9]|1[0-2])\/?([0-9]{2})$/,
      "Expiry date must be in MM/YY format"
    )
    .test("expiryDate", "Expiry date cannot be in the past", (value) => {
      if (!value) return false;
      const [month, year] = value.split("/");
      const now = new Date();
      const expiryDate = new Date(`20${year}`, month - 1);
      return expiryDate > now;
    })
    .required("Expiry date is required"),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits")
    .required("CVV is required"),
});

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    trigger,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(
      step === 1
        ? personalDetailsSchema
        : step === 2
        ? addressDetailsSchema
        : paymentDetailsSchema
    ),
  });

  const handleNext = async () => {
    const isValid = await trigger();
    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    setStep((prev) => prev - 1);
  };

  const handleFinalSubmit = () => {
    setModalOpen(true);
  };

  const onSubmit = () => {
    console.log(getValues());
    setModalOpen(false);
    alert("Details Submitted!");
  };

  const getProgressWidth = () => {
    switch (step) {
      case 1:
        return "0%";
      case 2:
        return "50%";
      case 3:
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 bg-white shadow-lg rounded-lg">
        {/* Step Progress Bar */}
        <div className="relative flex justify-between mb-6 items-center">
          <div className="absolute w-full h-1 bg-gray-300 top-1/2 -translate-y-1/2"></div>
          <div
            className="absolute h-1 bg-blue-500 top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out"
            style={{ width: getProgressWidth() }}
          ></div>

          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center relative z-10">
              <div
                className={`w-12 h-12 rounded-full ${
                  step >= i ? "bg-blue-500" : "bg-gray-300"
                } text-white flex items-center justify-center text-lg font-bold`}
              >
                {i}
              </div>
            </div>
          ))}
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit(handleFinalSubmit)} className="space-y-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Personal Details</h2>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("firstName")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="First Name"
                />
                <p className="text-red-500 mt-1">{errors.firstName?.message}</p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("lastName")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Last Name"
                />
                <p className="text-red-500 mt-1">{errors.lastName?.message}</p>
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  {...register("email")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Email"
                />
                <p className="text-red-500 mt-1">{errors.email?.message}</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Address Details</h2>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("address")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Address"
                />
                <p className="text-red-500 mt-1">{errors.address?.message}</p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("city")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="City"
                />
                <p className="text-red-500 mt-1">{errors.city?.message}</p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("postalCode")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Postal Code"
                />
                <p className="text-red-500 mt-1">
                  {errors.postalCode?.message}
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Payment Details</h2>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("cardNumber")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Card Number"
                />
                <p className="text-red-500 mt-1">
                  {errors.cardNumber?.message}
                </p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("expiryDate")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Expiry Date (MM/YY)"
                />
                <p className="text-red-500 mt-1">
                  {errors.expiryDate?.message}
                </p>
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  {...register("cvv")}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="CVV"
                />
                <p className="text-red-500 mt-1">{errors.cvv?.message}</p>
              </div>
            </div>
          )}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                className="px-4 py-2 bg-gray-500 text-white rounded"
                onClick={handlePrevious}
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>

        {/* Modal */}
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
              <button
                className="absolute top-4 right-4 text-gray-600 text-2xl"
                onClick={() => setModalOpen(false)}
              >
              </button>
              <h2 className="text-3xl font-bold mb-6">Confirmation</h2>
              <p className="text-lg mb-6">
                Please review the details below before submitting:
              </p>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Personal Details</h3>
                <p>
                  <strong>First Name:</strong> {getValues("firstName")}
                </p>
                <p>
                  <strong>Last Name:</strong> {getValues("lastName")}
                </p>
                <p>
                  <strong>Email:</strong> {getValues("email")}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Address Details</h3>
                <p>
                  <strong>Address:</strong> {getValues("address")}
                </p>
                <p>
                  <strong>City:</strong> {getValues("city")}
                </p>
                <p>
                  <strong>Postal Code:</strong> {getValues("postalCode")}
                </p>
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Payment Details</h3>
                <p>
                  <strong>Card Number:</strong> {getValues("cardNumber")}
                </p>
                <p>
                  <strong>Expiry Date:</strong> {getValues("expiryDate")}
                </p>
                <p>
                  <strong>CVV:</strong> {getValues("cvv")}
                </p>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  className="px-6 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                  onClick={onSubmit}
                >
                  Confirm
                </button>
                <button
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg shadow-md hover:bg-gray-600 transition duration-300"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
