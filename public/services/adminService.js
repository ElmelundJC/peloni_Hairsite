(async function getServices() {
    try {
        $.ajax({
            method: "GET",
            url: "/admin/servicePage",
            dataType: "json"
        }).done(function (data) {

            $.each(data, function (i, services) {

                $("#addData")
                    .append(
                        $("<tr> <td>" +
                            services.service
                            + "</td> <td>" +
                            services.description
                            + "</td> <td>" +
                            services.price
                            + "</td> <td>" +
                            // "<button class='btn btn-primary' href='#' data-toggle='modal' data-target='#modal' onclick=\'getServiceById('" + services._id + "')\' >Opdater</button>"
                            "<a href='#' onclick=\"getServiceById('" + services._id + "')\" data-toggle='modal' data-target='#modal'><span class='fas fa-edit'></span>Opdater</a>"
                            + "</td> <td>" +
                            // "<button class='btn btn-danger' onclick=\'deleteServiceById('" + services._id + "')\'>Slet</button>"
                            "<a href='#' onclick=\"deleteServiceById('" + services._id + "')\"><span class='fas fa-trash-alt'></span>Slet</a>"
                            + "</td> </tr>"

                            // "<a href='' onclick=\"viewProjectById('" + services._id + "')\" data-bs-toggle='modal' data-bs-target='#viewProjectModal'><span class='fas fa-eye'></span></a>" +
                            // "<a href='' onclick=\"getProjectById('" + services._id + "')\" data-bs-toggle='modal' data-bs-target='#updateProjectModal'><span class='fas fa-edit'></span></a>" +
                            // "<a href='' onclick=\"deleteProjectById('" + services._id + "')\"><span class='fas fa-trash-alt'></span></a>"
                            // + "</td> </tr>"
                        ))
            });
        })

    } catch (error) {
        console.log(error);
    }

})();

// Get a service by it's id
function getServiceById(id) {
    try {
        console.log(id)
        $.ajax({
            method: "GET",
            url: "/services/" + id,
            dataType: "json"
        }).done(function (service) {

            $("#editService").val(service.service);
            $("#editDescription").val(service.description);
            $("#editPrice").val(service.price);

            $("#updateForm").attr("action", "/services/" + service._id);
        }

        );
    } catch (error) {
        alert("Error")
        console.log(error);
    }
}

// Delete a project by its ID 
function deleteServiceById(id) {

    if (confirm("Er du sikker!")) {
        try {
            $.ajax({
                method: "DELETE",
                url: "/admin/services/" + id,
                dataType: "json"
            }).done(

                location.reload()
            );

        } catch (error) {
            alert("Error")
            console.log(error);
        }

    } else {
        console.log("Delete cancelled")
    }
};

// Update a service by it's id
function updateServiceById(id) {
    try {
        $.ajax({
            method: "POST",
            url: "/services/" + id,
            dataType: "json"
        }).done()
        location.reload()
    } catch (error) {
        console.log(error);
    }
}