import React, { Fragment, useRef, useState } from "react";
import { isObject, isArray, cloneDeep } from "lodash";

import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CloudDownloadIcon from "@mui/icons-material/CloudDownload";
import SendIcon from "@mui/icons-material/Send";
import GetAppIcon from "@mui/icons-material/GetApp";
import CircularProgress from "@mui/material/CircularProgress";
import { makeStyles } from "@mui/styles"; // Note: makeStyles import remains the same

import { useTheme } from '@mui/material/styles';
import { API_ENDPOINT, PayslipSampleData } from "./common";

import { CompanyInfo, EmployeeInfo, EarningAndDeduction, Success, Alert } from "./components";

const REST_FETCH_API = `${API_ENDPOINT}/payslip`;

const useStyles = makeStyles((theme) => ({
  layout: {
    width: "auto",
    marginLeft: 2,
    marginRight: 2,
    opacity: 0.9,
    
  },
  paper: {
    marginTop: 3,
    marginBottom: 3,
    padding: 2,
   
  },
  section: {
    marginTop: 4,
  },
  root: {
    marginTop: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    display: "none",
  },
  uploadButton: {
    cursor: "pointer",
    minWidth: "135px",
  },
  uploadText: {
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  girdButton: {
    marginBottom: 3,
  },
  addButton: {
    marginLeft: 1,
  },
  marginBottom2: {
    marginBottom: 2,
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 1,
    marginBottom:2,
  },
  button: {
    marginTop: 3,
    marginLeft: 1,
  },
  floatRight: {
    float: "right",
  },
  marginTop3: {
    marginTop: 3,
  },
}));

const initialData = {
  company: {
    icon: null,
    iconUrl: "",
    name: "",
    address: "",
  },
  employee: {
    name: "",
    email: "",
    id: "",
    position: "",
    joiningDate: null,
    uan: "",
    accountNumber: "",
    pfAccountNumber: "",
    paidDays: 0,
    lopDays: 0,
  },
  earnings: [],
  deductions: [],
  reimbursements: [],
};

export default function PayslipForm() {
  const classes = useStyles();

  const [result, setResult] = useState(null);
  const [alert, setAlert] = useState({ open: false, type: "", children: "" });
  const [isDownloadLoading, setIsDownloadLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const templateData = useRef(cloneDeep(initialData));
  const companyRef = useRef();
  const employeeRef = useRef();
  const earningRef = useRef();
  const deductionRef = useRef();
  const reimbursementRef = useRef();

  const handleReset = () => {
    templateData.current = cloneDeep(initialData);

    companyRef.current.reset(templateData.current.company);
    employeeRef.current.reset(templateData.current.employee);
    earningRef.current.reset(templateData.current.earnings);
    deductionRef.current.reset(templateData.current.deductions);
    reimbursementRef.current.reset(templateData.current.reimbursements);
  };

  const onSetSampleData = () => {
    templateData.current = cloneDeep(PayslipSampleData);

    companyRef.current.set(templateData.current.company);
    employeeRef.current.set(templateData.current.employee);
    earningRef.current.set(templateData.current.earnings);
    deductionRef.current.set(templateData.current.deductions);
    reimbursementRef.current.set(templateData.current.reimbursements);
  };

// ...
const REST_API = 'http://localhost:5000/admin'; // Replace with your actual backend URL

// ...

const handleFetchRequest = (type) => {
  return (event) => {
    event.preventDefault();

    // Rest of the function remains the same

    fetch(`${REST_API}/${type === 'download' ? 'generatePdf2' : 'sendEmail'}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templateData.current),
    })
		.then((response) => {
			console.log(response.data);
			console.log(templateData.current,JSON.stringify(templateData.current),'sss');
        if (!response.ok) {
          throw new Error('Request failed');
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'payslip.pdf');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);

        if (type === 'email') {
          setResult({ status: 'success', message: 'Email sent successfully' });
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResult({ status: 'error', message: 'Failed to generate PDF or send email' });
      });
  };
};


  return (
    <Fragment>
      <Alert {...alert} duration={5000} onClose={() => setAlert({ ...alert, open: false })} />
      <main className={classes.layout}>
        <Paper elevation={0} className={classes.paper}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Employee Payslip Generator
          </Typography>
          {result ? (
            alert('yes')
          ) : (
            <Fragment>
              <section className={classes.section}>
                <Button variant="contained" size="small" className={classes.floatRight} onClick={onSetSampleData}>
                  Apply with Sample Data
                </Button>
                <CompanyInfo templateData={templateData} classes={classes} ref={companyRef} />
                <EmployeeInfo templateData={templateData} classes={classes} ref={employeeRef} />
                <EarningAndDeduction type="earning" templateData={templateData} classes={classes} ref={earningRef} />
                <EarningAndDeduction
                  type="deduction"
                  templateData={templateData}
                  classes={classes}
                  ref={deductionRef}
                />
                <EarningAndDeduction
                  type="reimbursement"
                  templateData={templateData}
                  classes={classes}
                  ref={reimbursementRef}
                />
              </section>

              <div className={classes.buttons}>
                <Button variant="contained" onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={
                    isDownloadLoading ? <CircularProgress size={24} thickness={4} value={100} /> : <GetAppIcon />
                  }
                  onClick={handleFetchRequest("download")}
                  disabled={isDownloadLoading}
                  className={classes.button}
                >
                  Download as PDF
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isEmailLoading ? <CircularProgress size={24} thickness={4} value={100} /> : <SendIcon />}
                  onClick={handleFetchRequest("email")}
                  disabled={isEmailLoading}
                  className={classes.button}
                >
                  Send as Email
                </Button>
              </div>
            </Fragment>
          )}
        </Paper>
      </main>
    </Fragment>
  );
}
