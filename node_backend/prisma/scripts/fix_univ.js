import '../../utils/env_loader.js';

import prisma from '#prisma';

const UNIVERSITIES = [
  { rank: '1', name: 'Massachusetts Institute of Technology (MIT)', city: 'Cambridge', state: 'MA', lat: 42.3601, lng: -71.0942 },
  { rank: '3', name: 'Stanford University', city: 'Stanford', state: 'CA', lat: 37.4275, lng: -122.1697 },
  { rank: '5', name: 'Harvard University', city: 'Cambridge', state: 'MA', lat: 42.3742, lng: -71.1169 },
  { rank: '10', name: 'California Institute of Technology (Caltech)', city: 'Pasadena', state: 'CA', lat: 34.1377, lng: -118.1253 },
  { rank: '13', name: 'University of Chicago', city: 'Chicago', state: 'IL', lat: 41.7886, lng: -87.5987 },
  { rank: '15', name: 'University of Pennsylvania', city: 'Philadelphia', state: 'PA', lat: 39.9522, lng: -75.1932 },
  { rank: '16', name: 'Cornell University', city: 'Ithaca', state: 'NY', lat: 42.4534, lng: -76.4735 },
  { rank: '17', name: 'University of California, Berkeley (UCB)', city: 'Berkeley', state: 'CA', lat: 37.8719, lng: -122.2585 },
  { rank: '21', name: 'Yale University', city: 'New Haven', state: 'CT', lat: 41.3163, lng: -72.9223 },
  { rank: '24', name: 'Johns Hopkins University', city: 'Baltimore', state: 'MD', lat: 39.3299, lng: -76.6205 },
  { rank: '25', name: 'Princeton University', city: 'Princeton', state: 'NJ', lat: 40.3431, lng: -74.6551 },
  { rank: '38', name: 'Columbia University', city: 'New York City', state: 'NY', lat: 40.8075, lng: -73.9626 },
  { rank: '42', name: 'Northwestern University', city: 'Evanston', state: 'IL', lat: 42.0565, lng: -87.6753 },
  { rank: '45', name: 'University of Michigan-Ann Arbor', city: 'Ann Arbor', state: 'MI', lat: 42.278, lng: -83.7382 },
  { rank: '46', name: 'University of California, Los Angeles (UCLA)', city: 'Los Angeles', state: 'CA', lat: 34.0689, lng: -118.4452 },
  { rank: '52', name: 'Carnegie Mellon University', city: 'Pittsburgh', state: 'PA', lat: 40.4427, lng: -79.943 },
  { rank: '55', name: 'New York University (NYU)', city: 'New York City', state: 'NY', lat: 40.7295, lng: -73.9965 },
  { rank: '62', name: 'Duke University', city: 'Durham', state: 'NC', lat: 36.0014, lng: -78.9382 },
  { rank: '66', name: 'University of California, San Diego (UCSD)', city: 'San Diego', state: 'CA', lat: 32.8801, lng: -117.234 },
  { rank: '68', name: 'University of Texas at Austin', city: 'Austin', state: 'TX', lat: 30.2849, lng: -97.7341 },
  { rank: '69', name: 'Brown University', city: 'Providence', state: 'RI', lat: 41.8268, lng: -71.4025 },
  { rank: '70', name: 'University of Illinois Urbana-Champaign', city: 'Champaign', state: 'IL', lat: 40.102, lng: -88.2272 },
  { rank: '81', name: 'University of Washington', city: 'Seattle', state: 'WA', lat: 47.6553, lng: -122.3035 },
  { rank: '82', name: 'Pennsylvania State University', city: 'University Park', state: 'PA', lat: 40.7982, lng: -77.8599 },
  { rank: '88', name: 'Boston University', city: 'Boston', state: 'MA', lat: 42.3505, lng: -71.1054 },
  { rank: '88', name: 'Purdue University', city: 'West Lafayette', state: 'IN', lat: 40.4237, lng: -86.9212 },
  { rank: '110', name: 'University of Wisconsin-Madison', city: 'Madison', state: 'WI', lat: 43.0767, lng: -89.4125 },
  { rank: '114', name: 'University of California, Davis', city: 'Davis', state: 'CA', lat: 38.5382, lng: -121.7617 },
  { rank: '119', name: 'Rice University', city: 'Houston', state: 'TX', lat: 29.7174, lng: -95.4018 },
  { rank: '123', name: 'Georgia Institute of Technology', city: 'Atlanta', state: 'GA', lat: 33.7756, lng: -84.3963 },
  { rank: '140', name: 'University of North Carolina at Chapel Hill', city: 'Chapel Hill', state: 'NC', lat: 35.9049, lng: -79.0469 },
  { rank: '144', name: 'Texas A&M University', city: 'College Station', state: 'TX', lat: 30.618, lng: -96.3365 },
  { rank: '146', name: 'University of Southern California', city: 'Los Angeles', state: 'CA', lat: 34.0224, lng: -118.2851 },
  { rank: '161', name: 'Michigan State University', city: 'East Lansing', state: 'MI', lat: 42.7235, lng: -84.4822 },
  { rank: '167', name: 'Washington University in St. Louis', city: 'St. Louis', state: 'MO', lat: 38.6488, lng: -90.3108 },
  { rank: '173', name: 'Arizona State University', city: 'Tempe', state: 'AZ', lat: 33.4255, lng: -111.94 },
  { rank: '179', name: 'University of California, Santa Barbara (UCSB)', city: 'Santa Barbara', state: 'CA', lat: 34.414, lng: -119.8489 },
  { rank: '182', name: 'Emory University', city: 'Atlanta', state: 'GA', lat: 33.794, lng: -84.3241 },
  { rank: '190', name: 'The Ohio State University', city: 'Columbus', state: 'OH', lat: 40.0067, lng: -83.0305 },
  { rank: '207', name: 'University of Maryland, College Park', city: 'College Park', state: 'MD', lat: 38.9869, lng: -76.9426 },
  { rank: '210', name: 'University of Minnesota', city: 'Minneapolis', state: 'MN', lat: 44.974, lng: -93.2277 },
  { rank: '212', name: 'University of Florida', city: 'Gainesville', state: 'FL', lat: 29.6436, lng: -82.3549 },
  { rank: '236', name: 'University of Rochester', city: 'Rochester', state: 'NY', lat: 43.1284, lng: -77.6279 },
  { rank: '247', name: 'Dartmouth College', city: 'Hanover', state: 'NH', lat: 43.7022, lng: -72.2896 },
  { rank: '247', name: 'University of Massachusetts Amherst', city: 'Amherst', state: 'MA', lat: 42.3868, lng: -72.5301 },
  { rank: '250', name: 'Vanderbilt University', city: 'Nashville', state: 'TN', lat: 36.1447, lng: -86.8027 },
  { rank: '272', name: 'North Carolina State University', city: 'Raleigh', state: 'NC', lat: 35.7872, lng: -78.6822 },
  { rank: '275', name: 'University of Virginia', city: 'Charlottesville', state: 'VA', lat: 38.0336, lng: -78.508 },
  { rank: '281', name: 'University of Pittsburgh', city: 'Pittsburgh', state: 'PA', lat: 40.4444, lng: -79.9608 },
  { rank: '285', name: 'Georgetown University', city: 'Washington D.C.', state: 'DC', lat: 38.9076, lng: -77.0723 },
  { rank: '287', name: 'The University of Arizona', city: 'Tucson', state: 'AZ', lat: 32.2319, lng: -110.9501 },
  { rank: '293', name: 'University of California, Irvine', city: 'Irvine', state: 'CA', lat: 33.6405, lng: -117.8443 },
  { rank: '294', name: 'Case Western Reserve University', city: 'Cleveland', state: 'OH', lat: 41.5042, lng: -81.6076 },
  { rank: '294', name: 'University of Notre Dame', city: 'Notre Dame', state: 'IN', lat: 41.7002, lng: -86.2379 },
  { rank: '299', name: 'University of Colorado Boulder', city: 'Boulder', state: 'CO', lat: 40.0074, lng: -105.2663 },
  { rank: '306', name: 'Indiana University Bloomington', city: 'Bloomington', state: 'IN', lat: 39.1682, lng: -86.523 },
  { rank: '314', name: 'University of Miami', city: 'Miami', state: 'FL', lat: 25.7217, lng: -80.2779 },
  { rank: '328', name: 'Rutgers University–New Brunswick', city: 'New Brunswick', state: 'NJ', lat: 40.5008, lng: -74.4474 },
  { rank: '334', name: 'Tufts University', city: 'Medford', state: 'MA', lat: 42.4084, lng: -71.119 },
  { rank: '334', name: 'University of Illinois Chicago (UIC)', city: 'Chicago', state: 'IL', lat: 41.8708, lng: -87.6505 },
  { rank: '358', name: 'George Washington University', city: 'Washington D.C.', state: 'DC', lat: 38.8997, lng: -77.0478 },
  { rank: '358', name: 'Virginia Polytechnic Institute and State University', city: 'Blacksburg', state: 'VA', lat: 37.2296, lng: -80.4139 },
  { rank: '384', name: 'Northeastern University', city: 'Boston', state: 'MA', lat: 42.3398, lng: -71.0892 },
  { rank: '410', name: 'University at Buffalo SUNY', city: 'Buffalo', state: 'NY', lat: 43.0023, lng: -78.789 },
  { rank: '423', name: 'Washington State University', city: 'Pullman', state: 'WA', lat: 46.7298, lng: -117.1817 },
  { rank: '440', name: 'University of California, Riverside', city: 'Riverside', state: 'CA', lat: 33.9737, lng: -117.3281 },
  { rank: '449', name: 'Iowa State University', city: 'Ames', state: 'IA', lat: 42.0308, lng: -93.6319 },
  { rank: '452', name: 'Stony Brook University, State University of New York', city: 'Stony Brook', state: 'NY', lat: 40.9176, lng: -73.1236 },
  { rank: '458', name: 'Colorado State University', city: 'Fort Collins', state: 'CO', lat: 40.5734, lng: -105.0865 },
  { rank: '458', name: 'University of California, Santa Cruz', city: 'Santa Cruz', state: 'CA', lat: 36.9916, lng: -122.0583 },
  { rank: '465', name: 'University of Kansas', city: 'Lawrence', state: 'KS', lat: 38.9543, lng: -95.2558 },
  { rank: '525', name: 'The University of Georgia', city: 'Athens', state: 'GA', lat: 33.948, lng: -83.3774 },
  { rank: '526', name: 'Boston College', city: 'Chestnut Hill', state: 'MA', lat: 42.334, lng: -71.168 },
  { rank: '530', name: 'University of Iowa', city: 'Iowa City', state: 'IA', lat: 41.6611, lng: -91.5302 },
  { rank: '534', name: 'University of Connecticut', city: 'Storrs', state: 'CT', lat: 41.807, lng: -72.2495 },
  { rank: '540', name: 'University of Utah', city: 'Salt Lake City', state: 'UT', lat: 40.7649, lng: -111.8421 },
  { rank: '546', name: 'University of Hawaiʻi at Mānoa', city: 'Honolulu', state: 'HI', lat: 21.2999, lng: -157.8186 },
  { rank: '549', name: 'Florida State University', city: 'Tallahassee', state: 'FL', lat: 30.4418, lng: -84.2985 },
  { rank: '553', name: 'University of Delaware', city: 'Newark', state: 'DE', lat: 39.6784, lng: -75.7573 },
  { rank: '556', name: 'University of Houston', city: 'Houston', state: 'TX', lat: 29.7199, lng: -95.3422 },
  { rank: '571', name: 'Colorado School of Mines', city: 'Golden', state: 'CO', lat: 39.7555, lng: -105.2211 },
  { rank: '582', name: 'Florida International University', city: 'Miami', state: 'FL', lat: 25.7573, lng: -80.3756 },
  { rank: '587', name: 'American University', city: 'Washington D.C.', state: 'DC', lat: 38.9364, lng: -77.0855 },
  { rank: '591', name: 'Illinois Institute of Technology', city: 'Chicago', state: 'IL', lat: 41.8349, lng: -87.6275 },
  { rank: '597', name: 'Tulane University', city: 'New Orleans', state: 'LA', lat: 29.9389, lng: -90.1215 },
  { rank: '597', name: 'University of Texas at Dallas', city: 'Richardson', state: 'TX', lat: 32.9886, lng: -96.7479 },
  { rank: '607', name: 'The University of Tennessee, Knoxville', city: 'Knoxville', state: 'TN', lat: 35.9551, lng: -83.931 },
  { rank: '613', name: 'City University of New York', city: 'New York City', state: 'NY', lat: 40.7484, lng: -73.9967 },
  { rank: '624', name: 'Oregon State University', city: 'Corvallis', state: 'OR', lat: 44.5638, lng: -123.2794 },
  { rank: '624', name: 'Yeshiva University', city: 'New York City', state: 'NY', lat: 40.8505, lng: -73.9294 },
  { rank: '628', name: 'Missouri University of Science and Technology', city: 'Rolla', state: 'MO', lat: 37.9514, lng: -91.7713 },
  { rank: '628', name: 'University of South Carolina', city: 'Columbia', state: 'SC', lat: 33.9966, lng: -81.0285 },
  { rank: '654', name: 'University of South Florida', city: 'Tampa', state: 'FL', lat: 28.0587, lng: -82.4139 },
  { rank: '664', name: 'University of Oklahoma', city: 'Norman', state: 'OK', lat: 35.2058, lng: -97.4455 },
  { rank: '668', name: 'Lehigh University', city: 'Bethlehem', state: 'PA', lat: 40.6064, lng: -75.3783 },
  { rank: '673', name: 'Stevens Institute of Technology', city: 'Hoboken', state: 'NJ', lat: 40.744, lng: -74.0324 },
  { rank: '695', name: 'Rensselaer Polytechnic Institute', city: 'Troy', state: 'NY', lat: 42.73, lng: -73.6809 },
  { rank: '697', name: 'University of Missouri, Columbia', city: 'Columbia', state: 'MO', lat: 38.9404, lng: -92.3278 },
  { rank: '701', name: 'University of Central Florida', city: 'Orlando', state: 'FL', lat: 28.6024, lng: -81.2001 },
  { rank: '711', name: 'Drexel University', city: 'Philadelphia', state: 'PA', lat: 39.9566, lng: -75.1896 },
  { rank: '711', name: 'University of Nebraska - Lincoln', city: 'Lincoln', state: 'NE', lat: 40.8136, lng: -96.7026 },
  { rank: '721', name: 'Temple University', city: 'Philadelphia', state: 'PA', lat: 39.9811, lng: -75.1547 },
  { rank: '721', name: 'University of Cincinnati', city: 'Cincinnati', state: 'OH', lat: 39.1329, lng: -84.515 },
  { rank: '731', name: 'Texas Tech University', city: 'Lubbock', state: 'TX', lat: 33.5843, lng: -101.8827 },
  { rank: '741', name: 'Brandeis University', city: 'Waltham', state: 'MA', lat: 42.3665, lng: -71.2595 },
  { rank: '741', name: 'Syracuse University', city: 'Syracuse', state: 'NY', lat: 43.0481, lng: -76.1474 },
  { rank: '751', name: 'University of New Mexico', city: 'Albuquerque', state: 'NM', lat: 35.0844, lng: -106.622 },
  { rank: '751', name: 'University of Oregon', city: 'Eugene', state: 'OR', lat: 44.0456, lng: -123.0817 },
  { rank: '761', name: 'New Jersey Institute of Technology (NJIT)', city: 'Newark', state: 'NJ', lat: 40.742, lng: -74.1787 },
  { rank: '771', name: 'Rutgers University–Newark', city: 'Newark', state: 'NJ', lat: 40.7378, lng: -74.1745 },
  { rank: '781', name: 'Georgia State University', city: 'Atlanta', state: 'GA', lat: 33.7536, lng: -84.3852 },
  { rank: '781', name: 'University of Kentucky', city: 'Lexington', state: 'KY', lat: 38.0305, lng: -84.5037 },
  { rank: '781', name: 'Wayne State University', city: 'Detroit', state: 'MI', lat: 42.3572, lng: -83.0688 },
  { rank: '791', name: 'Wake Forest University', city: 'Winston-Salem', state: 'NC', lat: 36.1338, lng: -80.2784 },
  { rank: '801', name: 'The New School', city: 'New York City', state: 'NY', lat: 40.7358, lng: -74.001 },
  { rank: '801', name: 'University of Maryland, Baltimore', city: 'Baltimore', state: 'MD', lat: 39.2976, lng: -76.5975 },
  { rank: '801', name: 'University of Maryland, Baltimore County', city: 'Baltimore', state: 'MD', lat: 39.2557, lng: -76.711 },
  { rank: '851', name: 'Auburn University', city: 'Auburn', state: 'AL', lat: 32.6057, lng: -85.4872 },
  { rank: '851', name: 'Louisiana State University', city: 'Baton Rouge', state: 'LA', lat: 30.4133, lng: -91.18 },
  { rank: '851', name: 'Oklahoma State University', city: 'Stillwater', state: 'OK', lat: 36.1269, lng: -97.0706 },
  { rank: '851', name: 'University of Colorado, Denver', city: 'Denver', state: 'CO', lat: 39.7447, lng: -104.9874 },
  { rank: '851', name: 'Worcester Polytechnic Institute', city: 'Worcester', state: 'MA', lat: 42.2741, lng: -71.8063 },
  { rank: '901', name: 'Kansas State University', city: 'Manhattan', state: 'KS', lat: 39.1836, lng: -96.5717 },
  { rank: '901', name: 'Michigan Technological University', city: 'Houghton', state: 'MI', lat: 47.1155, lng: -88.5432 },
  { rank: '901', name: 'The University of Alabama', city: 'Tuscaloosa', state: 'AL', lat: 33.2119, lng: -87.544 },
  { rank: '901', name: 'University at Albany SUNY', city: 'Albany', state: 'NY', lat: 42.6864, lng: -73.8241 },
  { rank: '901', name: 'University of Alaska Fairbanks', city: 'Fairbanks', state: 'AK', lat: 64.8578, lng: -147.8206 },
  { rank: '901', name: 'University of North Texas', city: 'Denton', state: 'TX', lat: 33.2148, lng: -97.1331 },
  { rank: '901', name: 'Virginia Commonwealth University', city: 'Richmond', state: 'VA', lat: 37.549, lng: -77.4515 },
  { rank: '951', name: 'Clarkson University', city: 'Potsdam', state: 'NY', lat: 44.6698, lng: -74.9818 },
  { rank: '951', name: 'Clemson University', city: 'Clemson', state: 'SC', lat: 34.6834, lng: -82.8374 },
  { rank: '951', name: 'George Mason University', city: 'Fairfax', state: 'VA', lat: 38.8319, lng: -77.3099 },
  { rank: '951', name: 'Rochester Institute of Technology (RIT)', city: 'Rochester', state: 'NY', lat: 43.0855, lng: -77.6675 },
  { rank: '951', name: 'Saint Louis University', city: 'St. Louis', state: 'MO', lat: 38.6367, lng: -90.235 },
  { rank: '951', name: 'University of Massachusetts Boston', city: 'Boston', state: 'MA', lat: 42.312, lng: -71.0381 },
  { rank: '1001', name: 'Baylor University', city: 'Waco', state: 'TX', lat: 31.5493, lng: -97.1162 },
  { rank: '1001', name: 'Binghamton University SUNY', city: 'Binghamton', state: 'NY', lat: 42.0897, lng: -75.9679 },
  { rank: '1001', name: 'Brigham Young University', city: 'Provo', state: 'UT', lat: 40.2506, lng: -111.6493 },
  { rank: '1001', name: 'The City College of New York', city: 'New York City', state: 'NY', lat: 40.8195, lng: -73.9499 },
  { rank: '1001', name: 'Clark University', city: 'Worcester', state: 'MA', lat: 42.2508, lng: -71.8237 },
  { rank: '1001', name: 'William & Mary', city: 'Williamsburg', state: 'VA', lat: 37.2707, lng: -76.7075 },
  { rank: '1001', name: 'Florida Atlantic University', city: 'Boca Raton', state: 'FL', lat: 26.3742, lng: -80.1019 },
  { rank: '1001', name: 'Fordham University', city: 'New York City', state: 'NY', lat: 40.8604, lng: -73.8855 },
  { rank: '1001', name: 'Howard University', city: 'Washington D.C.', state: 'DC', lat: 38.9226, lng: -77.0197 },
  { rank: '1001', name: 'Indiana University Indianapolis', city: 'Indianapolis', state: 'IN', lat: 39.7748, lng: -86.1761 },
  { rank: '1001', name: 'Kent State University', city: 'Kent', state: 'OH', lat: 41.1516, lng: -81.3468 },
  { rank: '1001', name: 'Loyola University Chicago', city: 'Chicago', state: 'IL', lat: 41.9992, lng: -87.6586 },
  { rank: '1001', name: 'Mississippi State University', city: 'Starkville', state: 'MS', lat: 33.4562, lng: -88.7956 },
  { rank: '1001', name: 'Northern Arizona University', city: 'Flagstaff', state: 'AZ', lat: 35.1827, lng: -111.6566 },
  { rank: '1001', name: 'Ohio University', city: 'Athens', state: 'OH', lat: 39.3267, lng: -82.1021 },
  { rank: '1001', name: 'San Diego State University', city: 'San Diego', state: 'CA', lat: 32.7752, lng: -117.073 },
  { rank: '1001', name: 'Southern Methodist University', city: 'Dallas', state: 'TX', lat: 32.8412, lng: -96.7849 },
  { rank: '1001', name: 'University of Texas at Arlington', city: 'Arlington', state: 'TX', lat: 32.7299, lng: -97.1148 },
  { rank: '1001', name: 'University of Alabama at Birmingham', city: 'Birmingham', state: 'AL', lat: 33.5031, lng: -86.8003 },
  { rank: '1001', name: 'University of Arkansas Fayetteville', city: 'Fayetteville', state: 'AR', lat: 36.0682, lng: -94.1741 },
  { rank: '1001', name: 'University of Denver', city: 'Denver', state: 'CO', lat: 39.6781, lng: -104.9617 },
  { rank: '1001', name: 'University of Idaho', city: 'Moscow', state: 'ID', lat: 46.7267, lng: -117.0122 },
  { rank: '1001', name: 'University of Louisville', city: 'Louisville', state: 'KY', lat: 38.2137, lng: -85.7587 },
  { rank: '1001', name: 'University of Mississippi', city: 'Oxford', state: 'MS', lat: 34.3657, lng: -89.5398 },
  { rank: '1001', name: 'University of Missouri, Kansas City', city: 'Kansas City', state: 'MO', lat: 39.0389, lng: -94.5773 },
  { rank: '1001', name: 'University of Nevada - Reno', city: 'Reno', state: 'NV', lat: 39.5436, lng: -119.8162 },
  { rank: '1001', name: 'University of New Hampshire', city: 'Durham', state: 'NH', lat: 43.134, lng: -70.935 },
  { rank: '1001', name: 'University of North Carolina at Charlotte', city: 'Charlotte', state: 'NC', lat: 35.3077, lng: -80.7338 },
  { rank: '1001', name: 'University of Rhode Island', city: 'Kingston', state: 'RI', lat: 41.4802, lng: -71.5286 },
  { rank: '1001', name: 'University of Texas at San Antonio', city: 'San Antonio', state: 'TX', lat: 29.583, lng: -98.619 },
  { rank: '1001', name: 'University of Toledo', city: 'Toledo', state: 'OH', lat: 41.6638, lng: -83.6131 },
  { rank: '1001', name: 'University of Tulsa', city: 'Tulsa', state: 'OK', lat: 36.1509, lng: -95.9535 },
  { rank: '1001', name: 'University of Vermont', city: 'Burlington', state: 'VT', lat: 44.4775, lng: -73.1958 },
  { rank: '1001', name: 'University of Wyoming', city: 'Laramie', state: 'WY', lat: 41.3143, lng: -105.5666 },
  { rank: '1001', name: 'Utah State University', city: 'Logan', state: 'UT', lat: 41.7436, lng: -111.8135 },
  { rank: '1001', name: 'West Virginia University', city: 'Morgantown', state: 'WV', lat: 39.635, lng: -79.9545 },
  { rank: '1201', name: 'California Polytechnic State University', city: 'San Luis Obispo', state: 'CA', lat: 35.305, lng: -120.6625 },
  { rank: '1201', name: 'Marquette University', city: 'Milwaukee', state: 'WI', lat: 43.0384, lng: -87.9335 },
  { rank: '1201', name: 'Miami University', city: 'Oxford', state: 'OH', lat: 39.5091, lng: -84.7312 },
  { rank: '1201', name: 'New Mexico State University', city: 'Las Cruces', state: 'NM', lat: 32.2797, lng: -106.7443 },
  { rank: '1201', name: 'Portland State University', city: 'Portland', state: 'OR', lat: 45.5118, lng: -122.6832 },
  { rank: '1201', name: 'Pratt Institute', city: 'New York City', state: 'NY', lat: 40.6896, lng: -73.9629 },
  { rank: '1201', name: 'Seattle University', city: 'Seattle', state: 'WA', lat: 47.6087, lng: -122.32 },
  { rank: '1201', name: 'University of Memphis', city: 'Memphis', state: 'TN', lat: 35.1186, lng: -89.9378 },
  { rank: '1201', name: 'University of North Carolina at Greensboro', city: 'Greensboro', state: 'NC', lat: 36.0681, lng: -79.8137 },
  { rank: '1201', name: 'University of San Diego', city: 'San Diego', state: 'CA', lat: 32.7724, lng: -117.1904 },
  { rank: '1201', name: 'University of San Francisco', city: 'San Francisco', state: 'CA', lat: 37.7765, lng: -122.4503 },
  { rank: '1201', name: 'University of South Alabama', city: 'Mobile', state: 'AL', lat: 30.6947, lng: -88.1963 },
  { rank: '1201', name: 'University of Texas El Paso', city: 'El Paso', state: 'TX', lat: 31.7669, lng: -106.5014 },
  { rank: '1201', name: 'University of Wisconsin Milwaukee', city: 'Milwaukee', state: 'WI', lat: 43.0754, lng: -87.8803 },
  { rank: '1201', name: 'Western Michigan University', city: 'Kalamazoo', state: 'MI', lat: 42.2836, lng: -85.6045 },
  { rank: '1401', name: 'Central Michigan University', city: 'Mount Pleasant', state: 'MI', lat: 43.5978, lng: -84.7675 },
  { rank: '1401', name: 'Cleveland State University', city: 'Cleveland', state: 'OH', lat: 41.5022, lng: -81.675 },
  { rank: '1401', name: 'San Francisco State University', city: 'San Francisco', state: 'CA', lat: 37.722, lng: -122.4788 },
  { rank: '1401', name: 'University of Hawaii at Hilo', city: 'Hilo', state: 'HI', lat: 19.7024, lng: -155.0847 },
  { rank: '1401', name: 'University of Missouri Saint Louis', city: 'St. Louis', state: 'MO', lat: 38.7085, lng: -90.3118 },
  { rank: '1401', name: 'University of the Pacific', city: 'Stockton', state: 'CA', lat: 37.9779, lng: -121.3105 },
];

function normalizeName(value) {
  return value.trim().toLowerCase();
}

async function main() {
  const existingUniversities = await prisma.universities.findMany({
    where: {
      name: {
        in: UNIVERSITIES.map((university) => university.name),
      },
    },
    select: {
      id: true,
      name: true,
      location: true,
      state: true,
    },
  });

  const universitiesByName = new Map(existingUniversities.map((university) => [normalizeName(university.name), university]));

  let updatedCount = 0;
  let unchangedCount = 0;
  const missingUniversities = [];

  for (const university of UNIVERSITIES) {
    const existingUniversity = universitiesByName.get(normalizeName(university.name));

    if (!existingUniversity) {
      missingUniversities.push(university.name);
      continue;
    }

    const nextLocation = university.city.trim();
    const nextState = university.state.trim();

    if (existingUniversity.location === nextLocation && existingUniversity.state === nextState) {
      unchangedCount += 1;
      continue;
    }

    await prisma.universities.update({
      where: {
        id: existingUniversity.id,
      },
      data: {
        location: nextLocation,
        state: nextState,
      },
    });

    updatedCount += 1;
  }

  console.info(`Processed ${UNIVERSITIES.length} universities | updated=${updatedCount} | unchanged=${unchangedCount} | missing=${missingUniversities.length}`);

  if (missingUniversities.length > 0) {
    console.warn('Universities not found in database:');
    missingUniversities.forEach((universityName) => {
      console.warn(`- ${universityName}`);
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
