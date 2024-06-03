document.addEventListener('DOMContentLoaded', function() {
    const data = [
        { Candidate: 'Alice', Facility: 'Asheville', DrugTest: 'Yes', DrugTestPassed: 'Yes', DrugTestExpiration: '2024-06-01', BackgroundCheck: 'Yes', BackgroundCheckPassed: 'Yes' },
        { Candidate: 'Bob', Facility: 'Raleigh', DrugTest: 'No', DrugTestPassed: 'N/A', DrugTestExpiration: 'N/A', BackgroundCheck: 'Yes', BackgroundCheckPassed: 'Yes' },
        { Candidate: 'Charlie', Facility: 'Greeneville', DrugTest: 'Yes', DrugTestPassed: 'No', DrugTestExpiration: '2024-07-15', BackgroundCheck: 'No', BackgroundCheckPassed: 'N/A' },
        { Candidate: 'David', Facility: 'Asheville', DrugTest: 'Yes', DrugTestPassed: 'Yes', DrugTestExpiration: '2024-08-20', BackgroundCheck: 'Yes', BackgroundCheckPassed: 'Yes' },
        { Candidate: 'Eve', Facility: 'Raleigh', DrugTest: 'No', DrugTestPassed: 'N/A', DrugTestExpiration: 'N/A', BackgroundCheck: 'Yes', BackgroundCheckPassed: 'No' },
    ];

    const facilityTables = {
        'Asheville': document.querySelector('#asheville-table tbody'),
        'Raleigh': document.querySelector('#raleigh-table tbody'),
        'Greeneville': document.querySelector('#greeneville-table tbody')
    };

    function populateTable() {
        Object.values(facilityTables).forEach(tbody => tbody.innerHTML = '');

        data.forEach(candidate => {
            const row = document.createElement('tr');
            Object.values(candidate).forEach((text, index) => {
                const cell = document.createElement('td');
                cell.textContent = text;
                if (index === 4 && text === 'N/A') {
                    cell.textContent = '';
                }
                row.appendChild(cell);
            });
            facilityTables[candidate.Facility].appendChild(row);
        });
    }

    function prepareChartData(data, key) {
        const facilities = [...new Set(data.map(item => item.Facility))];
        const results = facilities.map(facility => {
            return {
                facility,
                yes: data.filter(item => item.Facility === facility && item[key] === 'Yes').length,
                no: data.filter(item => item.Facility === facility && item[key] === 'No').length,
                pending: data.filter(item => item.Facility === facility && item[key] === 'Pending').length,
                na: data.filter(item => item.Facility === facility && item[key] === 'N/A').length,
            };
        });
        return results;
    }

    function updateCharts() {
        const drugTestResults = prepareChartData(data, 'DrugTestPassed');
        drugTestChart.data.labels = drugTestResults.map(result => result.facility);
        drugTestChart.data.datasets[0].data = drugTestResults.map(result => result.yes);
        drugTestChart.data.datasets[1].data = drugTestResults.map(result => result.no);
        drugTestChart.data.datasets[2].data = drugTestResults.map(result => result.pending);
        drugTestChart.data.datasets[3].data = drugTestResults.map(result => result.na);
        drugTestChart.update();

        const bgCheckResults = prepareChartData(data, 'BackgroundCheck');
        bgCheckChart.data.labels = bgCheckResults.map(result => result.facility);
        bgCheckChart.data.datasets[0].data = bgCheckResults.map(result => result.yes);
        bgCheckChart.data.datasets[1].data = bgCheckResults.map(result => result.no);
        bgCheckChart.data.datasets[2].data = bgCheckResults.map(result => result.na);
        bgCheckChart.update();
    }

    const drugTestChart = new Chart(document.getElementById('drugTestChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Drug Test Passed',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Drug Test Failed',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
                {
                    label: 'Drug Test Pending',
                    data: [],
                    backgroundColor: 'rgba(255, 205, 86, 0.6)',
                },
                {
                    label: 'Drug Test N/A',
                    data: [],
                    backgroundColor: 'rgba(201, 203, 207, 0.6)',
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Drug Test Results by Facility',
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });

    const bgCheckChart = new Chart(document.getElementById('bgCheckChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Background Check Yes',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                },
                {
                    label: 'Background Check No',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
                {
                    label: 'Background Check N/A',
                    data: [],
                    backgroundColor: 'rgba(201, 203, 207, 0.6)',
                },
            ],
        },
        options: {
            title: {
                display: true,
                text: 'Background Check Results by Facility',
            },
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        },
    });

    document.getElementById('candidate-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const form = event.target;

        const newCandidate = {
            Candidate: form['candidate-name'].value,
            Facility: form['facility'].value,
            DrugTest: form['drug-test'].value,
            DrugTestPassed: form['drug-test-passed'].value,
            DrugTestExpiration: form['drug-test-expiration'].value || 'N/A',
            BackgroundCheck: form['background-check'].value,
            BackgroundCheckPassed: form['background-check-passed'].value,
        };

        data.push(newCandidate);
        populateTable();
        updateCharts();
        form.reset();
    });

    populateTable();
    updateCharts();
});
