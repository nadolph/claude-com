FROM node:22-bookworm

RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    git \
    curl \
    unzip \
    wget \
    sudo \
    && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg \
    && chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" > /etc/apt/sources.list.d/github-cli.list \
    && apt-get update && apt-get install -y gh \
    && rm -rf /var/lib/apt/lists/*

ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_HOME=/home/node/Android/Sdk
ENV PATH="$JAVA_HOME/bin:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

RUN mkdir -p $ANDROID_HOME/cmdline-tools \
    && curl -sL https://dl.google.com/android/repository/commandlinetools-linux-13114758_latest.zip -o /tmp/cmdline-tools.zip \
    && unzip -q /tmp/cmdline-tools.zip -d /tmp/cmdline-tools-extract \
    && mv /tmp/cmdline-tools-extract/cmdline-tools $ANDROID_HOME/cmdline-tools/latest \
    && rm -rf /tmp/cmdline-tools.zip /tmp/cmdline-tools-extract \
    && yes | sdkmanager --licenses \
    && sdkmanager "platform-tools" "build-tools;36.0.0" "platforms;android-36" "ndk;27.1.12297006" \
    && chown -R node:node /home/node/Android

RUN echo "node ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/node && \
    chmod 0440 /etc/sudoers.d/node

USER node

RUN echo '' >> ~/.bashrc \
    && echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc \
    && echo 'alias ll="ls -la"' >> ~/.bashrc \
    && echo 'alias lrt="ll -rt"' >> ~/.bashrc \
    && echo 'alias cld="claude --allow-dangerously-skip-permissions"' >> ~/.bashrc

RUN curl -fsSL https://claude.ai/install.sh | bash

RUN claude plugins marketplace add anthropics/claude-plugins-official \
    && claude plugins install superpowers --scope user
