const fetchAllProducts = async () => {
  try {
    const response = await fetch("https://desafio.xlow.com.br/search");
    if (!response.ok) throw new Error(`Erro HTTP! Status: ${response.status}`);

    const allData = await response.json();

    document.getElementById(
      "count"
    ).innerText = `${allData.length} Produtos encontrados.`;

    return allData.map((data) => data.productId);
  } catch (error) {
    console.error("Erro ao buscar todos os dados:", error);
    return [];
  }
};

const getProductData = async (productIds) => {
  const content = document.getElementById("content");
  content.innerHTML = "";

  const uniqueProductIds = productIds.filter(
    (id, index) => productIds.indexOf(id) === index
  );

  for (const id of uniqueProductIds) {
    try {
      const response = await fetch(`https://desafio.xlow.com.br/search/${id}`);
      const productData = await response.json();

      if (
        !productData[0] ||
        !productData[0].items ||
        !productData[0].items.length
      ) {
        console.warn(
          `Dados do produto ${id} não encontrados ou não são válidos.`
        );
        continue;
      }

      const productDetails = productData[0].items[0];

      const images = productDetails.images
        .map((img) => `<img src="${img.imageUrl}" alt="${img.imageText}">`)
        .join("");
      const productName = productData[0].productName;

      const priceOld = productDetails.sellers[0].commertialOffer.Price;
      const priceActualy = productDetails.sellers[0].commertialOffer.ListPrice;

      const productElement = document.createElement("div");
      productElement.classList.add("product");
      productElement.innerHTML = `  
            <img src="${
              productDetails.images[0].imageUrl
            }" alt="${productName}" class="image-main">  
            <h2 class="title">${productName}</h2>  
            <div class="mini">${images}</div>  
            <p class="price">  
            ${
              priceActualy > priceOld
                ? `<span class="price-old"> R$ ${priceOld.toFixed(2)} </span>`
                : ""
            }  
            <span class="price-actualy"> R$ ${priceActualy.toFixed(2)}</span>  
            </p>  
            
            <div class="btn-content"><button class="btn-buy">Comprar</button></div>
          `;

      const mini = productElement.querySelectorAll(".mini img");
      const imageMain = productElement.querySelector(".image-main");

      mini.forEach((element) => {
        element.addEventListener("click", () => {
          imageMain.src = element.src;
        });
      });

      content.appendChild(productElement);
    } catch (error) {
      console.error(`Erro ao buscar dados do produto ${id}:`, error);
      continue;
    }
  }
};

const updateGridLayout = () => {
  const content = document.getElementById("content");
  const mobile = window.innerWidth <= 768;
  if (mobile) {
    content.style.gridTemplateColumns = "repeat(1, 1fr)";
  } else {
    content.style.gridTemplateColumns = "repeat(4, 1fr)";
  }
};

const load = async () => {
  const productId = await fetchAllProducts();
  await getProductData(productId);

  updateGridLayout();

  window.addEventListener("resize", updateGridLayout);

  const toggleButton = document.getElementById("toggle-layout");
  toggleButton.addEventListener("click", () => {
    const content = document.getElementById("content");
    const columns =
      getComputedStyle(content).gridTemplateColumns.split(" ").length;
    if (window.innerWidth <= 768) {
      content.style.gridTemplateColumns =
        columns === 1 ? "repeat(2, 1fr)" : "repeat(1, 1fr)";
    } else {
      content.style.gridTemplateColumns =
        columns === 4 ? "repeat(5, 1fr)" : "repeat(4, 1fr)";
    }
  });
};

load();
