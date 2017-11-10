Feature: Demo Karate against Jenkins
  Scenario: Verify that Jenkins is up and running
    Given url 'http://localhost:8080/helloworld'
    When method get
    Then status 200
    And match response contains 'helloworld!'