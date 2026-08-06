// Cloudinary integration configuration placeholder
// Configured to load environment variables and export cloudinary instances.
export const uploadImage = async (fileStr) => {
  console.log("Mock uploading to Cloudinary:", fileStr.substring(0, 30) + "...");
  return {
    secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    public_id: "sample_id"
  };
};
