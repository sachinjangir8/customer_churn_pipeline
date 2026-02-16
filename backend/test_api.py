"""
API Testing Script
Tests all backend endpoints
"""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_health_check():
    """Test health check endpoint"""
    print("\n" + "="*80)
    print("Testing Health Check Endpoint")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/api/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200

def test_model_info():
    """Test model info endpoint"""
    print("\n" + "="*80)
    print("Testing Model Info Endpoint")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/api/model/info")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    
    return response.status_code == 200

def test_features():
    """Test features endpoint"""
    print("\n" + "="*80)
    print("Testing Features Endpoint")
    print("="*80)
    
    response = requests.get(f"{BASE_URL}/api/features")
    print(f"Status Code: {response.status_code}")
    data = response.json()
    print(f"Required Features: {len(data['required_features']['categorical']) + len(data['required_features']['numerical'])}")
    print(f"Categorical: {len(data['required_features']['categorical'])}")
    print(f"Numerical: {len(data['required_features']['numerical'])}")
    
    return response.status_code == 200

def test_single_prediction():
    """Test single prediction endpoint"""
    print("\n" + "="*80)
    print("Testing Single Prediction Endpoint")
    print("="*80)
    
    # Sample customer data
    customer_data = {
        "gender": "Male",
        "SeniorCitizen": 0,
        "Partner": "Yes",
        "Dependents": "No",
        "tenure": 12,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "DSL",
        "OnlineSecurity": "Yes",
        "OnlineBackup": "No",
        "DeviceProtection": "No",
        "TechSupport": "Yes",
        "StreamingTV": "No",
        "StreamingMovies": "No",
        "Contract": "One year",
        "PaperlessBilling": "No",
        "PaymentMethod": "Bank transfer (automatic)",
        "MonthlyCharges": 55.0,
        "TotalCharges": 660.0
    }
    
    print("Input Data:")
    print(json.dumps(customer_data, indent=2))
    
    response = requests.post(
        f"{BASE_URL}/api/predict",
        json=customer_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Prediction Result:")
    print(json.dumps(response.json(), indent=2))
    
    return response.status_code == 200

def test_batch_prediction():
    """Test batch prediction endpoint"""
    print("\n" + "="*80)
    print("Testing Batch Prediction Endpoint")
    print("="*80)
    
    # Sample batch data
    batch_data = [
        {
            "gender": "Male",
            "SeniorCitizen": 0,
            "Partner": "Yes",
            "Dependents": "No",
            "tenure": 12,
            "PhoneService": "Yes",
            "MultipleLines": "No",
            "InternetService": "DSL",
            "OnlineSecurity": "Yes",
            "OnlineBackup": "No",
            "DeviceProtection": "No",
            "TechSupport": "Yes",
            "StreamingTV": "No",
            "StreamingMovies": "No",
            "Contract": "One year",
            "PaperlessBilling": "No",
            "PaymentMethod": "Bank transfer (automatic)",
            "MonthlyCharges": 55.0,
            "TotalCharges": 660.0
        },
        {
            "gender": "Female",
            "SeniorCitizen": 1,
            "Partner": "No",
            "Dependents": "No",
            "tenure": 2,
            "PhoneService": "Yes",
            "MultipleLines": "No",
            "InternetService": "Fiber optic",
            "OnlineSecurity": "No",
            "OnlineBackup": "No",
            "DeviceProtection": "No",
            "TechSupport": "No",
            "StreamingTV": "Yes",
            "StreamingMovies": "Yes",
            "Contract": "Month-to-month",
            "PaperlessBilling": "Yes",
            "PaymentMethod": "Electronic check",
            "MonthlyCharges": 95.0,
            "TotalCharges": 190.0
        }
    ]
    
    print(f"Testing with {len(batch_data)} customers...")
    
    response = requests.post(
        f"{BASE_URL}/api/predict/batch",
        json=batch_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\nStatus Code: {response.status_code}")
    print(f"Batch Results:")
    print(json.dumps(response.json(), indent=2))
    
    return response.status_code == 200

def test_recommendations():
    """Test recommendations endpoint"""
    print("\n" + "="*80)
    print("Testing Recommendations Endpoint")
    print("="*80)
    
    # High churn risk customer
    customer_data = {
        "gender": "Female",
        "SeniorCitizen": 1,
        "Partner": "No",
        "Dependents": "No",
        "tenure": 2,
        "PhoneService": "Yes",
        "MultipleLines": "No",
        "InternetService": "Fiber optic",
        "OnlineSecurity": "No",
        "OnlineBackup": "No",
        "DeviceProtection": "No",
        "TechSupport": "No",
        "StreamingTV": "Yes",
        "StreamingMovies": "Yes",
        "Contract": "Month-to-month",
        "PaperlessBilling": "Yes",
        "PaymentMethod": "Electronic check",
        "MonthlyCharges": 95.0,
        "TotalCharges": 190.0
    }
    
    response = requests.post(
        f"{BASE_URL}/api/recommendations",
        json=customer_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"Status Code: {response.status_code}")
    print(f"Recommendations:")
    print(json.dumps(response.json(), indent=2))
    
    return response.status_code == 200

def run_all_tests():
    """Run all API tests"""
    print("\n" + "🚀 Starting API Tests")
    print("="*80)
    print(f"Base URL: {BASE_URL}")
    print("="*80)
    
    tests = [
        ("Health Check", test_health_check),
        ("Model Info", test_model_info),
        ("Features", test_features),
        ("Single Prediction", test_single_prediction),
        ("Batch Prediction", test_batch_prediction),
        ("Recommendations", test_recommendations)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, "✅ PASSED" if success else "❌ FAILED"))
        except Exception as e:
            results.append((test_name, f"❌ ERROR: {str(e)}"))
    
    # Print summary
    print("\n" + "="*80)
    print("Test Summary")
    print("="*80)
    for test_name, result in results:
        print(f"{test_name:.<50} {result}")
    
    passed = sum(1 for _, result in results if "PASSED" in result)
    total = len(results)
    
    print("="*80)
    print(f"Tests Passed: {passed}/{total}")
    print("="*80)

if __name__ == "__main__":
    try:
        run_all_tests()
    except KeyboardInterrupt:
        print("\n\nTests interrupted by user")
    except Exception as e:
        print(f"\n\nFatal error: {str(e)}")
        print("\nMake sure the backend server is running at http://localhost:5000")
