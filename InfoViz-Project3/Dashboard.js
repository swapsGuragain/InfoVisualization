let globalData = null;

function loadData() {
    d3.csv('a1-cars.csv').then(data => {
        globalData = data;
        initializeFilters(); // Assuming this function creates filter options and listens for changes
    }).catch(error => {
        console.error("Error loading the data: ", error);
    });
}

// dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    loadData();
});

function loadData() {
    d3.csv('a1-cars.csv').then(data => {
        console.log("Data Loaded: ", data); // Check the data in the console
        window.globalData = data;
        initializeFilters(data);
        updateAllCharts();
    }).catch(error => {
        console.error("Error loading the data: ", error);
    });
}

function initializeFilters(data) {
    const modelYearSelect = document.getElementById('modelYear'); // Ensure ID is in lowercase if your HTML defines it as such
    const manufacturerSelect = document.getElementById('manufacturer'); // Ensure ID is in lowercase

    modelYearSelect.addEventListener('change', updateAllCharts);
    manufacturerSelect.addEventListener('change', updateAllCharts);

    populateFilters(data); // Optionally move the population logic here
}

function populateFilters(data) {
    const years = Array.from(new Set(data.map(d => d.ModelYear)));
    const manufacturers = Array.from(new Set(data.map(d => d.Manufacturer)));

    const modelYearSelect = document.getElementById('modelYear');
    const manufacturerSelect = document.getElementById('manufacturer');

    years.forEach(year => {
        modelYearSelect.add(new Option(year, year));
    });

    manufacturers.forEach(manufacturer => {
        manufacturerSelect.add(new Option(manufacturer, manufacturer));
    });
}

function updateAllCharts() {
    const selectedYear = document.getElementById('modelYear').value;
    const selectedManufacturer = document.getElementById('manufacturer').value;
    const filteredData = filterData(selectedYear, selectedManufacturer);

    updateChart1(filteredData);
    updateChart2(filteredData);
    updateChart3(filteredData);
}

function filterData(selectedYear, selectedManufacturer) {
    return window.globalData.filter(item =>
        (selectedYear === 'all' || item.ModelYear === selectedYear) &&
        (selectedManufacturer === 'all' || item.Manufacturer === selectedManufacturer)
    );
}
