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
                            + "</td> </tr>"
                        ))
            });
        })

    } catch (error) {
        console.log(error);
    }

})();