import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UpdateProfile.css";
import Loader from "./Loader";
import { useNotification } from "./NotificationContext";


const UpdateProfile = () => {
  const [bio, setBio] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [category, setCategory] = useState("");
  const [profilePhoto, setProfile] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [skills, setSkills] = useState("");
  const [badges, setBadges] = useState("");
  const [achievements, setAchievements] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {setProfilePhoto}=useNotification();
  // Function to handle file selection
  const handleFileChange = (event, setter) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setter(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // Append only non-empty fields to FormData
    if (bio) formData.append("bio", bio);
    if (department) formData.append("department", department);
    if (year) formData.append("year", year);
    if (category) formData.append("category", category);
    if (skills) formData.append("skills", skills);
    if (badges) formData.append("badges", badges);
    if (achievements) formData.append("achievements", achievements);
    if (location) formData.append("location", location);

    // Append image files
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);
    const userId=localStorage.getItem("user");
    try {
      setLoading(true);
      const response = await axios.put("http://localhost:5000/api/users/updateprofile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      alert("Profile updated successfully!");
      setProfilePhoto(response.data.user.profilePicture);
      navigate(`/profile/${userId}`)
    } catch (error) {
      
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true); // Script is already loaded
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleAlumniPayment = async () => {
  try {
    setLoading(true);
    /* console.log("entered"); */

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    // Fetch order details from the backend
    const { data } = await axios.post(
      "http://localhost:5000/api/payment",
      { amount: 2 }, // Amount in INR
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const options = {
      key: "rzp_test_6lXQP2dJmktdCG", // Replace with your Razorpay key
      amount: data.amount,
      currency: "INR",
      name: "Alumni Membership",
      description: "Pay to verify as an Alumni",
      order_id: data.id,
      handler: async (response) => {
          // Step 3: Verify Payment
          const verifyRes = await axios.post("http://localhost:5000/api/payment/verify-payment", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          },{
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
          if (verifyRes.data.success) {
            alert("Payment Successful!");
            handlePaymentSuccess();
          } else {
            alert("Payment Verification Failed!");
          }},
      prefill: {
        name: "alumini-user",
        email: "alumni@example.com",
        contact: "9999999999",
      },
      theme: { color: "#3399cc" },
    };
    /* console.log("entered 3"); */

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment Error:", error);
    alert("Payment Failed. Try Again.");
  } finally {
    setLoading(false);
  }
};
const handlePaymentSuccess=async()=>{
  setLoading(true);

    const formData = new FormData();
    
    // Append only non-empty fields to FormData
    if (bio) formData.append("bio", bio);
    if (department) formData.append("department", department);
    if (year) formData.append("year", year);
    if (category) formData.append("category", category);
    if (skills) formData.append("skills", skills);
    if (badges) formData.append("badges", badges);
    if (achievements) formData.append("achievements", achievements);
    if (location) formData.append("location", location);

    // Append image files
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    if (coverPhoto) formData.append("coverPhoto", coverPhoto);
    const userId=localStorage.getItem("user");
    try {
      setLoading(true);
      const response = await axios.put("http://localhost:5000/api/users/updateprofile", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      alert("Profile updated successfully!");
      setProfilePhoto(response.data.user.profilePicture);
      navigate(`/profile/${userId}`)
    } catch (error) {
      
      console.error("Error updating profile:", error);
      alert(error.response?.data?.message || "Failed to update profile!");
    } finally {
      setLoading(false);
    }
}
  return (
    <div className="update-profile-container">
    {loading?<Loader />:<>
      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit}>
        {/* Profile Photo Upload */}
        <label>Profile Photo:</label>
          <div className="image-preview">
            {profilePhoto ? (
              <img src={URL.createObjectURL(profilePhoto)} alt="Profile Preview" />
            ) : (
              <p>No Profile Photo Selected</p>
            )}
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setProfile)} />

          {/* Cover Photo Upload with Preview */}
          <label>Cover Photo:</label>
          <div className="cover-preview">
            {coverPhoto ? (
              <img src={URL.createObjectURL(coverPhoto)} alt="Cover Preview" />
            ) : (
              <p>No Cover Photo Selected</p>
            )}
          </div>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCoverPhoto)} />

        {/* Bio */}
        <label>Bio (Max 50 characters):</label>
        <input type="text" value={bio} onChange={(e) => setBio(e.target.value)} maxLength="50" placeholder="Write a short bio..." />

        {/* Department */}
        <label>Department:</label>
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">Select Department</option>
          <option value="CSE">CSE</option>
          <option value="EEE">EEE</option>
          <option value="Civil">Civil</option>
          <option value="Mech">Mech</option>
          <option value="ECE">ECE</option>
          <option value="MBA">MBA</option>
        </select>

        {/* Year */}
        <label>Year:</label>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">Select Year</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>

        {/* Category */}
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Student">Student</option>
          <option value="Lecturer">Lecturer</option>
          <option value="Alumini">Alumini</option>
        </select>

        {/* Skills */}
        <label>Skills (comma-separated):</label>
        <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="E.g., JavaScript, React, Node.js" />

        {/* Badges */}
        <label>Badges (comma-separated):</label>
        <input type="text" value={badges} onChange={(e) => setBadges(e.target.value)} placeholder="E.g., AI Enthusiast, Problem Solver" />

        {/* Achievements */}
        <label>Achievements (Max 100 characters):</label>
        <textarea value={achievements} onChange={(e) => setAchievements(e.target.value)} maxLength="100" placeholder="List your achievements..."></textarea>

        {/* Location */}
        <label>Location:</label>
        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="E.g., Nerawada, Nandyal (AP)" />
        {/* If Alumni is selected, show Razorpay Payment Button */}
          {category === "Alumini" && (
            <button
              type="button"
              className="alumni-payment-button"
               onClick={handleAlumniPayment} 
            >
              Pay ₹2 Rupees for Alumni Verification
            </button>
          )}
        {/* Submit Button */}
        {category !== "Alumini" && (
        <button type="submit" className="update-button" disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>)}
      </form>
      </>}
    </div>
  );
};

export default UpdateProfile;
