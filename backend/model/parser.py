# import pdfplumber
# import pandas as pd
# import re
# from typing import List, Dict, Union
# import logging
# import pickle

# class PentestReportParser:
#     """Parser for extracting vulnerability information from penetration testing reports."""

#     def __init__(self, logging_level=logging.INFO):
#         """Initialize the parser with logging configuration."""
#         logging.basicConfig(
#             level=logging_level,
#             format='%(asctime)s - %(levelname)s - %(message)s'
#         )
#         self.logger = logging.getLogger(__name__)

#     def is_vulnerability_table(self, table: List[List[str]]) -> bool:
#         """
#         Determine if a table is likely a vulnerability table based on its headers
#         and content.
#         """
#         if not table or not table[0]:
#             return False

#         # Common headers in vulnerability tables
#         vulnerability_headers = {
#             'vulnerability', 'risk', 'cvss', 'severity', 'location',
#             'finding', 'description', 'hosts'
#         }

#         # Convert headers to lowercase for case-insensitive comparison
#         headers = {str(cell).lower() for cell in table[0]}

#         # Check if at least 2 common headers are present
#         return len(headers.intersection(vulnerability_headers)) >= 2

#     def get_vulnerabilty_data(self, pdf_path: str):
#         """
#         Process a PDF file and extract vulnerability information.
#         Returns a pandas DataFrame with the extracted data.
#         """
#         self.logger.info(f"Processing PDF: {pdf_path}")
#         all_vulnerabilities = []

#         try:
#             with pdfplumber.open(pdf_path) as pdf:
#                 for page_num, page in enumerate(pdf.pages, 1):
#                     self.logger.debug(f"Processing page {page_num}")

#                     # Extract tables from the page
#                     tables = page.extract_tables()

#                     for table in tables:
#                         if not self.is_vulnerability_table(table):
#                             continue
#                         # Process headers
#                         headers = [str(cell).strip() for cell in table[0]]

#                         # Process each row
#                         for row in table[1:]:
#                             # print(row)
#                             if not row or all(cell is None or cell.strip() == '' for cell in row):
#                                 continue

#                             vulnerability_data = {}
#                             for header, cell in zip(headers, row):
#                                 if header.lower() == 'cvss' or header.lower() == 'risk':
#                                   if pd.notna(cell) and str(cell).strip():  # Check if cell is not NaN and not empty
#                                     vulnerability_data[header] = str(cell).strip()
#                             if vulnerability_data:
#                               all_vulnerabilities.append(vulnerability_data)

#         except FileNotFoundError:
#             self.logger.error(f"File not found: {pdf_path}")
#             raise

#         except Exception as e:
#             self.logger.error(f"Error processing PDF: {str(e)}")
#             raise
#         # for i in all_vulnerabilities:
#         #   print(i)
#         print(all_vulnerabilities)
#         return all_vulnerabilities

#     def get_pentest_score(self, pdf_path: str):
#         # Define risk mapping
#         risk_mapping = {
#             'Critical': 4,
#             'High': 3,
#             'Medium': 2,
#             'Low': 1
#         }

#         vulnerability_data = self.get_vulnerabilty_data(pdf_path)
#         vulnerability_score = 0.0
#         total = 0
#         # Calculate scores
#         for vulnerability in vulnerability_data:
#             risk = vulnerability.get('Risk')
#             cvss_value = vulnerability.get('CVSS')

#             if risk in risk_mapping and cvss_value not in ['NA', '']:
#                 try:
#                     cvss_numeric = float(cvss_value)  # Convert CVSS to float
#                     vulnerability_score += risk_mapping[risk] * cvss_numeric  # Calculate score
#                     total += 1
#                 except ValueError:
#                     vulnerability['Score'] = None  # Handle non-numeric CVSS values
#             else:
#                 vulnerability['Score'] = None  # If risk is invalid or CVSS is NA
#         return vulnerability_score / total

# def main():
#     """Example usage of the parser."""
#     parser = PentestReportParser()

#     # Example usage for single PDF
#     pdf_path = "/content/Penetration Test.pdf"
#     score = parser.get_pentest_score(pdf_path)
#     print(score)

# if __name__ == "__main__":
#     main()
import pdfplumber
import pandas as pd
import re
import logging
import traceback
import os

class PentestReportParser:
    def __init__(self, logging_level=logging.INFO, timeout=30):
        """
        Initialize the parser with configurable logging and timeout
        
        :param logging_level: Logging level (default: INFO)
        :param timeout: Parsing timeout in seconds (default: 30)
        """
        logging.basicConfig(
            level=logging_level,
            format='%(asctime)s - %(levelname)s - %(message)s'
        )
        self.logger = logging.getLogger(__name__)
        self.timeout = timeout

    def is_vulnerability_table(self, table):
        """
        Determine if a table is likely a vulnerability table
        """
        if not table or not table[0]:
            return False

        vulnerability_headers = {
            'vulnerability', 'risk', 'cvss', 'severity', 'location',
            'finding', 'description', 'hosts'
        }

        headers = {str(cell).lower() for cell in table[0] if cell}
        return len(headers.intersection(vulnerability_headers)) >= 2

    def get_vulnerabilty_data(self, pdf_path):
        """
        Process a PDF file and extract vulnerability information with safety checks
        """
        self.logger.info(f"Processing PDF: {pdf_path}")
        
        # Validate file exists and is not too large
        if not os.path.exists(pdf_path):
            self.logger.error(f"File not found: {pdf_path}")
            return []
        
        file_size = os.path.getsize(pdf_path)
        if file_size > 75 * 1024 * 1024:  # 50MB limit
            self.logger.error(f"File too large: {file_size} bytes")
            return []

        all_vulnerabilities = []

        try:
            with pdfplumber.open(pdf_path) as pdf:
                # Limit pages to first 10 to prevent timeout
                # for page_num, page in enumerate(pdf.pages[:10], 1):
                for page_num, page in enumerate(pdf.pages, 1):
                    self.logger.debug(f"Processing page {page_num}")

                    tables = page.extract_tables()
                    for table in tables:
                        if not self.is_vulnerability_table(table):
                            continue

                        headers = [str(cell).strip() for cell in table[0]]

                        for row in table[1:]:
                            if not row or all(cell is None or cell.strip() == '' for cell in row):
                                continue

                            vulnerability_data = {}
                            for header, cell in zip(headers, row):
                                if header.lower() in ['cvss', 'risk']:
                                    if pd.notna(cell) and str(cell).strip():
                                        vulnerability_data[header] = str(cell).strip()
                            
                            if vulnerability_data:
                                all_vulnerabilities.append(vulnerability_data)

        except Exception as e:
            self.logger.error(f"Error processing PDF: {str(e)}")
            self.logger.error(traceback.format_exc())
            return []
        
        return all_vulnerabilities

    def get_pentest_score(self, pdf_path):
        """
        Calculate pentest score with robust error handling
        """
        # Define risk mapping
        risk_mapping = {
            'Critical': 4,
            'High': 3,
            'Medium': 2,
            'Low': 1
        }

        try:
            vulnerability_data = self.get_vulnerabilty_data(pdf_path)
            
            if not vulnerability_data:
                return 0.0

            vulnerability_score = 0.0
            total = 0

            for vulnerability in vulnerability_data:
                risk = vulnerability.get('Risk')
                cvss_value = vulnerability.get('CVSS')

                if risk in risk_mapping and cvss_value not in ['NA', '']:
                    try:
                        cvss_numeric = float(cvss_value)
                        vulnerability_score += risk_mapping.get(risk, 1) * cvss_numeric
                        total += 1
                    except (ValueError, TypeError):
                        continue

            # Prevent division by zero
            return vulnerability_score / total if total > 0 else 0.0

        except Exception as e:
            self.logger.error(f"Score calculation error: {str(e)}")
            return 0.0

def main():
    """Example usage of the parser."""
    parser = PentestReportParser()

    # Example usage for single PDF
    # pdf_path = "/content/Penetration Test.pdf"
    pdf_path = "/Users/belagaam/Downloads/Penetration Test.pdf"
    score = parser.get_pentest_score(pdf_path)
    print(score)

if __name__ == "__main__":
    main()