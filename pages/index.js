import fs from 'fs'
import path from 'path'
import Gallery from '../components/Gallery'
import { withBasePath } from '../lib/asset'

export default function Home({ images }){
  return (
    <div>
      <header className="site-header">
        <div className="container">
          <h1>EEG Spectral Biomarkers for Schizophrenia</h1>
          <p className="summary">We identify EEG spectral and connectivity markers that discriminate schizophrenia from healthy controls using a focal supervised contrastive learning pipeline and classical classifiers. The site emphasizes the figures and interpretable findings from attention and attribution analyses.</p>
        </div>
      </header>

      <main className="container">
        <nav aria-label="Table of contents">
          <strong>Contents:</strong> <a href="#introduction">Introduction</a> · <a href="#dataset">Dataset</a> · <a href="#methods">Methods</a> · <a href="#results">Results</a> · <a href="#interpretation">Interpretation</a> · <a href="#discussion">Discussion</a> · <a href="#figures">Figures</a> · <a href="#references">References</a>
        </nav>

        <section id="introduction">
          <h2>Introduction</h2>
          <p>Schizophrenia is a severe, chronic psychiatric disorder characterized by disturbances in thought, perception, behavior, and affect. Current clinical diagnosis relies on interviews and behavioral observation, which are subjective and typically occur after chronic symptoms appear. There is a pressing clinical need for objective, physiological biomarkers that enable earlier and more reliable identification of the disorder.</p>
          <p>Electroencephalography (EEG) offers a non-invasive window into neural synchrony and spectral dynamics relevant to schizophrenia. However, EEG presents technical challenges — high dimensionality, low spatial resolution, and susceptibility to noise — which require specialized preprocessing and learning strategies to identify robust biomarkers.</p>
        </section>

        <section id="dataset">
          <h2>Dataset and prior preprocessing</h2>
          <p>We used a public EEG dataset (Park et al., 2021) that was preprocessed with a 1–45 Hz bandpass filter and hybrid automated-manual artifact rejection (epochs exceeding ±100 μV removed). The data were transformed to the frequency domain via FFT to produce Power Spectral Density (PSD) features across standard bands and coherence measures capturing inter-electrode functional connectivity.</p>
          <p>The feature space includes PSD for six bands across 19 channels (n≈114) plus coherence across unique electrode pairs (n≈1,026), yielding roughly 1,140 features per sample.</p>
        </section>

        <section id="methods">
          <h2>Methods</h2>
          <h3>Preprocessing and sampling</h3>
          <p>Non-EEG demographic variables were removed. Missing numerical values (&lt;5%) were imputed using Random Forest (MissForest). PSD and coherence features were standardized to zero mean and unit variance. To prevent leakage, SMOTE oversampling was applied independently within each training fold. Performance was assessed with stratified 10-fold cross-validation; each training fold used a 20% validation split for hyperparameter tuning.</p>

          <h3>Learning pipeline</h3>
          <p>We employ a multi-stage pipeline:</p>
          <ol>
            <li>Feature standardization and within-fold SMOTE.</li>
            <li>Dimensionality reduction via a Focal Supervised Contrastive (SupCon) encoder that compresses 1,140 features to a 256-dimensional backbone and a 3-dimensional projection for visualization.</li>
            <li>Downstream classification using SVM (RBF) on both backbone and 3-D embeddings, and comparison with classical models (Random Forest, SVM-RFE).</li>
          </ol>

          <h3>Model architecture and training</h3>
          <p>The encoder is a residual MLP with Squeeze-and-Excitation (SE) attention blocks; the SE blocks provide feature-wise excitation weights that aid interpretability. Training uses a focal-modified SupCon loss that emphasizes hard/ambiguous samples (focal parameter γ = 2.0) and a temperature τ = 0.02. Regularization included dropout (≈0.54), Gaussian signal augmentation (σ=0.012), cosine learning-rate annealing, and weight decay.</p>
          <div className="methods-figure-wrapper">
            <img src={withBasePath('/images/image5.png')} alt="Methods figure" className="methods-figure" />
            <p className="methods-figure-text">Figure (Methods): Pipeline overview — data preprocessing, within-fold SMOTE, focal supervised contrastive encoder, and downstream classifiers. This figure summarizes the end-to-end pipeline used to extract spectral and coherence biomarkers.</p>
          </div>
        </section>

        <section id="results">
          <h2>Results</h2>
          <p>The SupCon encoder compressed the 1,140-dimensional input into a structured 3-D manifold while preserving discriminative signal. Key results:</p>
          <ul>
            <li>Focal SupCon + encoder reached a peak generalization accuracy of 85.4% for HC vs SCZ classification.</li>
            <li>The 3-D projection maintained an 83.3% separability score; SVM trained on the 256-d backbone achieved the strongest linear separability.</li>
            <li>Comparative classical models: SVM (linear/RBF) and Random Forest were used as baselines; SVM-RFE identified a reduced set of stable features for classical classifiers.</li>
          </ul>
          <p>Confusion matrices showed balanced sensitivity and specificity with strong SCZ detection. Optimal hyperparameters (learning rate = 1e-4, weight decay = 2e-3, SE reduction ratio = 8) were selected via grid search.</p>

          <h3>Main result figures</h3>
          <p className="note">Key figures highlighting model performance and embeddings. Image 4 is emphasized.</p>
          <div className="results-grid">
            <figure className="result-figure"><img src={withBasePath('/images/image1.png')} alt="Result 1"/></figure>
            <figure className="result-figure"><img src={withBasePath('/images/image2.png')} alt="Result 2"/></figure>
            <figure className="result-figure"><img src={withBasePath('/images/image3.png')} alt="Result 3"/></figure>
            <figure className="result-figure highlight"><img src={withBasePath('/images/image4.png')} alt="Result 4 (highlight)"/></figure>
          </div>
        </section>

        <section id="interpretation">
          <h2>Interpretation &amp; Feature Importance</h2>
          <h3>SE attention</h3>
          <p>SE attention weights highlighted delta, theta, and alpha bands, and emphasized specific electrode sites (posterior T5/T6 and temporal probes) as predictive. By ranking SE weights we derived the most critical coherence biomarkers per band.</p>

          <h3>Integrated Gradients &amp; Shapley analyses</h3>
          <p>Integrated Gradients provided gradient-based attributions for the SupCon encoder; Shapley analyses corroborated these findings. Notable patterns included:</p>
          <ul>
            <li><strong>Delta:</strong> Increased posterior delta (T5, T6, O1, O2) associated with SCZ; frontal delta associated with HC.</li>
            <li><strong>Alpha:</strong> Reduced alpha power (alpha desynchronization) associated with SCZ.</li>
            <li><strong>Theta:</strong> Lower theta PSD in SCZ, consistent with impaired cognitive coordination.</li>
            <li><strong>Beta:</strong> Elevated beta (beta hyperfrontality) linked to cortical hyperexcitability and cognitive deficits.</li>
          </ul>
        </section>

        <section id="discussion">
          <h2>Discussion &amp; Future Directions</h2>
          <p>Our pipeline identifies robust spectral and connectivity markers that align with the literature: posterior delta increases, alpha desynchronization, reduced theta, and elevated beta in schizophrenia. The combination of contrastive embeddings with attention and gradient-based interpretability yields markers that are both predictive and clinically meaningful.</p>
          <p>To advance clinical translation we recommend multi-modal integration (EEG + MRI), continued refinement of explainable AI approaches, and prospective validation on independent cohorts.</p>
        </section>

        <section id="figures">
          <h2>Figures</h2>
          <p className="note">Figure captions are left editable so you can paste the manuscript captions or custom text.</p>
          <Gallery images={images} />
        </section>

        <section id="references">
          <h2>References (selected)</h2>
          <ul>
            <li>American Psychiatric Association. Diagnostic and Statistical Manual of Mental Disorders. 5th ed. 2013.</li>
            <li>Park et al., 2021. Identification of Major Psychiatric Disorders From Resting-State EEG Using ML. Frontiers in Psychiatry.</li>
            <li>Hu et al., 2017. Squeeze-and-Excitation Networks.</li>
            <li>Stekhoven &amp; Bühlmann, 2011. MissForest imputation.</li>
            <li>Lapuschkin et al., 2019. Unmasking Clever Hans predictors.</li>
          </ul>
          <p className="note">Full reference list available in the manuscript; paste any additional citations you want shown here.</p>
        </section>

      </main>

      <footer className="site-footer"><div className="container">Generated from the manuscript. Edit content and captions as needed.</div></footer>
    </div>
  )
}

export async function getStaticProps(){
  const file = path.join(process.cwd(),'public','images.json')
  let images = []
  try{ images = JSON.parse(fs.readFileSync(file,'utf8')) }catch(e){ images = [] }
  return { props: { images } }
}
