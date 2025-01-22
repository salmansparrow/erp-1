import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import heroImage1 from "../../public/images/hero.jpg";
import heroImage2 from "../../public/images/hero2.jpg";
import heroImage3 from "../../public/images/hero3.jpg";
import featureIcon1 from "../../public/images/feature1.png";
import featureIcon2 from "../../public/images/feature2.png";
import featureIcon3 from "../../public/images/feature3.png";
import footerLogo from "../../public/images/logo/logo.png";
import adImage from "../../public/images/ad.jpg"; // Example dialog image
import Link from "next/link";

const LandingPage = () => {
  const [openDialog, setOpenDialog] = useState(true); // State for dialog

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box>
      {/* Dialog for Ad or Outlet Image */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            maxWidth: "500px",
            width: "90%",
            borderRadius: 2,
            overflow: "hidden",
          },
        }}
      >
        <DialogContent sx={{ position: "relative", padding: 0 }}>
          <IconButton
            onClick={handleCloseDialog}
            sx={{
              position: "absolute",
              top: 10,
              left: 10,
              color: "white",
              backgroundColor: "rgba(0,0,0,0.6)",
              "&:hover": { backgroundColor: "rgba(0,0,0,0.8)" },
            }}
          >
            <CloseIcon />
          </IconButton>
          <Image src={adImage} alt="Ad Image" layout="responsive" priority />
        </DialogContent>
      </Dialog>

      {/* Hero Section with Heading */}
      <Box
        sx={{
          textAlign: "center",
          padding: 4,
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 2,
            fontSize: { xs: "2rem", md: "3rem" },
          }}
        >
          Welcome to American Safety Power Tool Limited
        </Typography>
        <Typography
          variant="h6"
          sx={{
            mb: 3,
            fontSize: { xs: "1rem", md: "1.5rem" },
          }}
        >
          Empowering your workforce with our state-of-the-art solutions
        </Typography>

        <Link href="https://americansafety.com.pk/">
          <Button
            variant="contained"
            color="primary"
            size="large"
            sx={{ textTransform: "uppercase" }}
          >
            Explore Now
          </Button>
        </Link>
      </Box>

      {/* Slider */}
      <Box>
        <Slider {...sliderSettings}>
          {[heroImage1, heroImage2, heroImage3].map((image, index) => (
            <Box
              key={index}
              sx={{
                height: { xs: "50vh", sm: "60vh", md: "70vh" }, // Adjust height for responsiveness
                width: "100%",
                backgroundImage: `url(${image.src})`,
                backgroundSize: "contain", // Ensure the entire image fits within the container
                backgroundRepeat: "no-repeat", // Prevent tiling
                backgroundPosition: "center", // Center the image within the container
              }}
            />
          ))}
        </Slider>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, textAlign: "center", backgroundColor: "#f9f9f9" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 6 }}>
          Tools
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            {
              icon: featureIcon1,
              title: "Hourly DashBoard",
              description:
                "Simplify workflows and improve efficiency across all departments.",
              link: "/hourlydashboard",
            },
            {
              icon: featureIcon2,
              title: "Adding Data",
              description:
                "Gain actionable insights with data-driven dashboards.",
              link: "/hourlyproduction/hourlyproductionpage",
            },
            {
              icon: featureIcon3,
              title: "Summaries",
              description: "Connect teams seamlessly and boost productivity.",
              link: "/linesummary",
            },
          ].map((feature, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <Link
                href={feature.link}
                passHref
                style={{ textDecoration: "none" }}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    boxShadow: 3,
                    padding: 3,
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.3s ease",
                    },
                  }}
                >
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={80}
                    height={80}
                  />
                  <Typography variant="h6" sx={{ mt: 2 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </Link>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Footer Section */}
      <Box
        sx={{
          backgroundColor: "#2e3b55",
          color: "white",
          py: 5,
          textAlign: "center",
        }}
      >
        <Box>
          <Image src={footerLogo} alt="Footer Logo" width={100} height={80} />
        </Box>
        <Typography variant="body2" sx={{ mt: 2 }}>
          © {new Date().getFullYear()} American Safety Power Tool Limited. All
          rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default LandingPage;
