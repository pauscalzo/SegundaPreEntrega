document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM cargado');
    document.querySelectorAll('.addToCartButton').forEach(button => {
        button.addEventListener('click', async function() {
            console.log('Clic en el botón "Agregar al Carrito"');
            const pid = this.getAttribute('data-productid');
            console.log('ID del producto:', pid);
            try {
                const response = await fetch(`/cart/${cid}/${pid}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                console.log('Respuesta del servidor:', data);
                // Si la respuesta del servidor indica éxito, puedes agregar algún mensaje de confirmación aquí
                if (data.result === "success") {
                    console.log("Producto agregado al carrito correctamente.");
                    // Aquí puedes agregar cualquier otra acción que desees realizar después de agregar el producto al carrito
                } else {
                    console.error("Error al agregar el producto al carrito:", data.message);
                    // Aquí puedes manejar el caso de que haya ocurrido un error al agregar el producto al carrito
                }
            } catch (error) {
                console.error('Error al agregar el producto al carrito:', error);
            }
        });
    });
});


