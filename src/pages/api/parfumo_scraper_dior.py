
# Requires: playwright
# Install it via: pip install playwright
# Then run: playwright install

from playwright.sync_api import sync_playwright
import time
import json

def scrape_parfumo_dior():
    base_url = "https://www.parfumo.net/Perfumes/Dior"
    scraped_data = []

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        page = browser.new_page()
        page.goto(base_url)
        time.sleep(2)

        # Scroll to load more items if needed, can loop for pagination
        perfume_links = page.locator(".pgrid.mb-1.mt-1 .col.col-normal a").all()
        links = [el.get_attribute("href") for el in perfume_links if el.get_attribute("href")]

        print(f"Found {len(links)} perfumes")

        for relative_link in links[:5]:  # limit to 5 for testing
            perfume_url = "https://www.parfumo.net" + relative_link
            page.goto(perfume_url)
            time.sleep(1)

    # Accept cookies if needed
    try:
        page.wait_for_selector("#notice button", timeout=5000)
        page.click("#notice button")
        print("Cookie banner accepted.")
    except:
        print("No cookie banner detected or already accepted.")

    # Now scrape from the perfume page
    name = page.locator("h1[itemprop='name']").text_content().strip()
    brand = page.locator("h1 span span").nth(0).text_content().strip()
    concentration = page.locator("span.p_con.label_a.pointer.upper").nth(0).text_content().strip() if page.locator("span.p_con.label_a.pointer.upper").count() else ""

    def extract_notes(selector):
        note_block = page.locator(selector)
        notes = []
        if note_block.count() > 0:
            spans = note_block.locator(".right span span")
            for i in range(spans.count()):
                notes.append(spans.nth(i).text_content().strip())
        return notes

    notes = {
        "top": extract_notes(".nb_t .right"),
        "middle": extract_notes(".nb_m .right"),
        "base": extract_notes(".nb_b .right"),
    }

    scraped_data.append({
        "name": name,
        "brand": brand,
        "concentration": concentration,
        "notes": notes,
        "url": perfume_url
    })
    time.sleep(1)


    browser.close()

    with open("dior_scraped.json", "w", encoding="utf-8") as f:
        json.dump(scraped_data, f, indent=2, ensure_ascii=False)

    print("Scraping complete. Data saved to dior_scraped.json.")

if __name__ == "__main__":
    scrape_parfumo_dior()
