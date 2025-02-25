# BioLearn Web Interface

A web-based interface for the BioLearn Python library that allows users to upload methylation data and obtain epigenetic clock analysis scores through an intuitive UI.

See https://github.com/danduma/vibe-epigenetic-age-backend for the backend implementation.

## Features

- File upload interface for CSV files containing methylation matrices
- Asynchronous processing of uploaded files
- RESTful API for managing samples and retrieving results
- Status tracking for uploaded samples
- Error handling and validation
- Support for multiple epigenetic clocks (Horvath, Hannum, PhenoAge)
- Statistical analysis of methylation data

## Technical Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Shadcn UI

## Setup

### Environment Setup

1. Make sure you have Node.js installed (version 16 or higher recommended)
2. Clone this repository
3. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Development Mode
To run the application in development mode with hot-reload:
```bash
npm run dev
```
This will start the development server, typically at http://localhost:5173

#### Production Build
To build the application for production:
```bash
npm run build
```
This will generate optimized static files in the `dist` directory.

To preview the production build locally:
```bash
npm run preview
```

## API Documentation



## File Format

The application accepts CSV files containing methylation matrices. The expected format is:
- Each row represents a CpG site (methylation probe)
- Each column represents a sample
- Values should be beta values between 0 and 1

## Epigenetic Clocks

The application currently supports the following epigenetic clocks:
- Horvath's Clock (2013)
- Hannum's Clock (2013)
- PhenoAge Clock (Levine et al., 2018)
