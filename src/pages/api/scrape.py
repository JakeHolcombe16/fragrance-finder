from playwright.sync_api import sync_playwright
import time
import re


def scrape_parfumo_brand(brand_url, max_perfumes=5):
    data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(brand_url, timeout=60000)

        # Get perfume links
        perfume_links = page.eval_on_selector_all(
            ".col.col-normal a",
            "elements => elements.map(e => e.href)"
        )
        perfume_links = list(dict.fromkeys(perfume_links))  # Deduplicate
        perfume_links = perfume_links[:max_perfumes]  # Limit for testing

        for link in perfume_links:
            page.goto(link, timeout=60000)
            time.sleep(1)

            # Name
            name = page.query_selector("h1[itemprop='name']")
            name_text = name.inner_text().strip() if name else None

            # Brand
            brand = page.query_selector("h1 > span > span")
            brand_text = brand.inner_text().strip() if brand else None

            # Concentration
            conc = page.query_selector("h1 > span > span > span.p_con")
            conc_text = conc.inner_text().strip() if conc else None

            # Notes
            def extract_notes(selector):
                return page.eval_on_selector_all(
                    selector,
                    "els => els.map(e => e.innerText.trim())"
                )

            top_notes = extract_notes(".nb_t .right .nowrap.pointer span:last-child")
            heart_notes = extract_notes(".nb_m .right .nowrap.pointer span:last-child")
            base_notes = extract_notes(".nb_b .right .nowrap.pointer span:last-child")

            data.append({
                "name": name_text,
                "brand": brand_text,
                "concentration": conc_text,
                "notes": {
                    "top": top_notes,
                    "heart": heart_notes,
                    "base": base_notes
                },
                "url": link
            })

        browser.close()

    return data


brand_url = "https://www.parfumo.net/Perfumes/Dior"
results = scrape_parfumo_brand(brand_url, max_perfumes=3)

import pandas as pd
import ace_tools as tools; tools.display_dataframe_to_user(name="Sample Fragrances", dataframe=pd.DataFrame(results))
