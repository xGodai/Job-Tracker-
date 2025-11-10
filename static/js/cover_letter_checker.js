(function(){
    var form = document.getElementById('id_job_description');
    var fileInput = document.getElementById('id_cover_letter');

    form.addEventListener('submit', function(e){
        // Basic client-side validation to ensure a PDF is selected
        var file = fileInput.files[0];
        if (!file) {
            e.preventDefault();
            alert('Please select a PDF to upload.');
            fileInput.focus();
            return;
        }
        // Some browsers may not set file.type reliably; check extension fallback
        var isPdf = (file.type === 'application/pdf') || /\.pdf$/i.test(file.name);
        if (!isPdf) {
            e.preventDefault();
            alert('The uploaded file must be a PDF.');
            fileInput.focus();
            return;
        }
    }, false);
})();
